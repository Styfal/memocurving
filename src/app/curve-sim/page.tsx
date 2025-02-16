

'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';

// ---------------------
// Type definitions
// ---------------------

interface CardSet {
  id: string;
  title: string;
  description: string;
  cards: any[]; // flashcard content (not used in scheduling here)
  lastReviewed: number;   // timestamp in ms (0 if never reviewed)
  reviewCount: number;
  createdBy: {
    uid: string;
    displayName?: string;
    email?: string;
  };
}

interface TableRowData {
  id: string;
  title: string;
  lastReviewed: string;
  reviewCount: number;
  nextReview: string;
}

// ---------------------
// Helper functions
// ---------------------

// Format a timestamp to "DD MMM YYYY" (e.g. "15 Feb 2025")
const formatDate = (timestamp: number): string => {
  if (!timestamp) return 'Never';
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(timestamp).toLocaleDateString(undefined, options);
};

// Returns the number of days passed since lastReviewed (if never reviewed, returns 0)
const daysSinceReview = (lastReviewed: number): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  if (lastReviewed === 0) return 0;
  return (Date.now() - lastReviewed) / msPerDay;
};

// Retention algorithm: Retention = 100 * 0.8^(daysSinceReview / (1 + reviewCount))
const calculateRetention = (days: number, reviewCount: number): number => {
  return 100 * Math.pow(0.8, days / (1 + reviewCount));
};

// Next review time: scheduled (reviewCount+1) days after lastReviewed.
// If never reviewed, schedule next review for 1 day from now.
const getNextReviewTime = (lastReviewed: number, reviewCount: number): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  if (lastReviewed === 0) return Date.now() + msPerDay;
  return lastReviewed + (reviewCount + 1) * msPerDay;
};

// Build calendar data for the current month. Returns an array of weeks, each week is an array of cells.
// Each cell is either null (if no day) or an object with day number, date, and an array of CardSet titles due that day.
interface CalendarCell {
  day: number;
  date: Date;
  setsDue: CardSet[];
}

const getCalendarData = (userSets: CardSet[]): CalendarCell[][] => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  // Number of days in current month:
  const numDays = new Date(year, month + 1, 0).getDate();
  // Create an array for each day
  const cells: CalendarCell[] = [];
  for (let day = 1; day <= numDays; day++) {
    const date = new Date(year, month, day);
    // Format date for comparison
    const dateStr = date.toDateString();
    // For each user card set, determine its next review date.
    const setsDue = userSets.filter((cs) => {
      const nextReview = new Date(getNextReviewTime(cs.lastReviewed, cs.reviewCount));
      return nextReview.toDateString() === dateStr;
    });
    cells.push({ day, date, setsDue });
  }

  // Now, we need to group cells into weeks.
  // Determine the day of week of the first day (0=Sunday, 6=Saturday)
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const weeks: (CalendarCell | null)[][] = [];
  let week: (CalendarCell | null)[] = [];
  // Fill initial empty cells.
  for (let i = 0; i < firstDayOfWeek; i++) {
    week.push(null);
  }
  cells.forEach((cell) => {
    week.push(cell);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  // If remaining cells, fill with null until week has 7 cells.
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    weeks.push(week);
  }
  return weeks;
};

// ---------------------
// Main Component
// ---------------------

const EbbinghausCurve: React.FC = () => {
  const [cardSets, setCardSets] = useState<CardSet[]>([]);
  const [updating, setUpdating] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Subscribe to Firebase Auth for current user.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // Fetch all card sets from API.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/cardsets');
        const json = await res.json();
        if (json.success && json.data) {
          setCardSets(json.data);
        } else {
          console.error('No card sets returned from API.');
        }
      } catch (error) {
        console.error('Error fetching card sets:', error);
      }
    })();
  }, []);

  // Filter to only include current user's card sets.
  const userCardSets = currentUser
    ? cardSets.filter((cs) => cs.createdBy && cs.createdBy.uid === currentUser.uid)
    : [];

  // Build table data.
  const tableData: TableRowData[] = userCardSets.map((cs) => {
    const lastReviewedStr = formatDate(cs.lastReviewed);
    const nextReviewTime = getNextReviewTime(cs.lastReviewed, cs.reviewCount);
    const nextReviewStr = formatDate(nextReviewTime);
    return {
      id: cs.id,
      title: cs.title,
      lastReviewed: lastReviewedStr,
      reviewCount: cs.reviewCount,
      nextReview: nextReviewStr,
      currentRetention: '', // We remove this column.
    };
  });

  // Handler: Finish review session for a given card set.
  const finishReviewSession = async (id: string) => {
    const cs = userCardSets.find((set) => set.id === id);
    if (!cs) return;
    const newLastReviewed = Date.now();
    const newReviewCount = cs.reviewCount + 1;
    const updatedSet = { ...cs, lastReviewed: newLastReviewed, reviewCount: newReviewCount };

    setUpdating(true);
    try {
      const res = await fetch(`/api/cardsets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: updatedSet.title,
          description: updatedSet.description,
          cards: updatedSet.cards,
          lastReviewed: updatedSet.lastReviewed,
          reviewCount: updatedSet.reviewCount,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        console.error('Error updating card set:', json.error);
      } else {
        setCardSets((prev) =>
          prev.map((set) => (set.id === id ? updatedSet : set))
        );
      }
    } catch (error) {
      console.error('Error updating card set:', error);
    }
    setUpdating(false);
  };

  // Build calendar data for the current month.
  const calendarWeeks = getCalendarData(userCardSets);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">My Flashcard Sets</h2>
        {userCardSets.length === 0 ? (
          <p className="text-center">No flashcard sets found for your account.</p>
        ) : (
          <div className="overflow-x-auto shadow-md border border-gray-300 rounded mb-8">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">Title</th>
                  <th className="border p-2 text-left">Last Reviewed</th>
                  <th className="border p-2 text-left">Review Count</th>
                  <th className="border p-2 text-left">Next Review Date</th>
                  <th className="border p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="border p-2">{row.title}</td>
                    <td className="border p-2">{row.lastReviewed}</td>
                    <td className="border p-2">{row.reviewCount}</td>
                    <td className="border p-2">{row.nextReview}</td>
                    <td className="border p-2">
                      {Date.now() >= new Date(row.nextReview).getTime() ? (
                        <Button
                          onClick={() => finishReviewSession(row.id)}
                          disabled={updating}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
                        >
                          {updating ? 'Updating...' : 'Finish Review'}
                        </Button>
                      ) : (
                        <span className="text-gray-600 text-xs">Not Due</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Calendar View */}
        <h2 className="text-3xl font-bold mb-6 text-center">Review Calendar</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <th key={day} className="border p-2 text-center">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calendarWeeks.map((week, wIndex) => (
                <tr key={wIndex}>
                  {week.map((cell, cIndex) => (
                    <td key={cIndex} className="border p-2 align-top h-20">
                      {cell ? (
                        <div>
                          <div className="text-sm font-semibold">{cell.day}</div>
                          {cell.setsDue.length > 0 && (
                            <ul className="mt-1 text-xs">
                              {cell.setsDue.map((cs) => (
                                <li key={cs.id} className="text-blue-600">{cs.title}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ) : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EbbinghausCurve;
