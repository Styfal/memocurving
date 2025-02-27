


'use client';

import React, { useEffect, useState, ChangeEvent, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { BookOpen, Users, Upload, ArrowLeft, ArrowRight } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

//
// Helper Functions
//

// Format a timestamp as "DD MMM YYYY"
const formatDate = (timestamp: number | undefined): string => {
  if (!timestamp || timestamp === 0) return 'Never';
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(timestamp).toLocaleDateString(undefined, options);
};

const daysSinceReview = (lastReviewed: number): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  if (lastReviewed === 0) return 0;
  return (Date.now() - lastReviewed) / msPerDay;
};

const calculateRetention = (days: number, reviewCount: number): number => {
  return 100 * Math.pow(0.8, days / (1 + reviewCount));
};

const getNextReviewTime = (lastReviewed: number, reviewCount: number): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  if (lastReviewed === 0) return Date.now() + msPerDay;
  return lastReviewed + (reviewCount + 1) * msPerDay;
};

const getTomorrowRange = () => {
  const today = new Date();
  const tomorrowStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const tomorrowEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
  return { start: tomorrowStart.getTime(), end: tomorrowEnd.getTime() };
};

interface CalendarCell {
  day: number;
  date: Date;
  setsDue: CardSet[];
}

// Updated to accept a displayDate for month navigation.
const getCalendarData = (sets: CardSet[], displayDate: Date): (CalendarCell | null)[][] => {
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  const numDays = new Date(year, month + 1, 0).getDate();
  const cells: CalendarCell[] = [];
  for (let day = 1; day <= numDays; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toDateString();
    const setsDue = sets.filter(cs => {
      const nextReview = new Date(getNextReviewTime(cs.lastReviewed, cs.reviewCount));
      return nextReview.toDateString() === dateStr;
    });
    cells.push({ day, date, setsDue });
  }
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const weeks: (CalendarCell | null)[][] = [];
  let week: (CalendarCell | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    week.push(null);
  }
  cells.forEach(cell => {
    week.push(cell);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    weeks.push(week);
  }
  return weeks;
};

//
// Main Component
//

interface CardSet {
  id: string;
  title: string;
  description: string;
  cards: any[];
  lastReviewed: number;
  reviewCount: number;
  createdBy: {
    uid: string;
    displayName?: string;
    email?: string;
  };
}

export function QuizletDashboard() {
  // Profile states
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userName, setUserName] = useState('User Name');
  const [userBio, setUserBio] = useState('');
  const [userAvatar, setUserAvatar] = useState('/placeholder.svg?height=80&width=80');
  const [creationDate, setCreationDate] = useState("unknown");
  const [lastLogin, setLastLogin] = useState("unknown");

  // Profile dialog control
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  // Flashcard sets and calendar states
  const [cardSets, setCardSets] = useState<CardSet[]>([]);
  const [calendarWeeks, setCalendarWeeks] = useState<(CalendarCell | null)[][]>([]);
  const [selectedDaySets, setSelectedDaySets] = useState<CardSet[]>([]);
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);

  // New state for flashcard set details modal
  const [selectedSet, setSelectedSet] = useState<CardSet | null>(null);

  // New state for calendar navigation (displayed month)
  const [calendarDate, setCalendarDate] = useState(new Date());

  // New state for review badge dialog
  const [selectedReviewSets, setSelectedReviewSets] = useState<CardSet[]>([]);
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user) {
        if (user.metadata.creationTime) {
          setCreationDate(new Date(user.metadata.creationTime).toLocaleDateString());
        }
        if (user.metadata.lastSignInTime) {
          setLastLogin(new Date(user.metadata.lastSignInTime).toLocaleString());
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch profile data
  useEffect(() => {
    async function fetchUserData() {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.name) setUserName(data.name);
          if (data.bio) setUserBio(data.bio);
          if (data.avatar) setUserAvatar(data.avatar);
        }
      }
    }
    fetchUserData();
  }, [currentUser]);

  // Save profile changes and close dialog
  const handleProfileSave = async () => {
    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid);
      await updateDoc(docRef, {
        name: userName,
        bio: userBio,
        // avatar: userAvatar, // Avatar upload is commented out for now.
      });
      setProfileDialogOpen(false);
    }
  };

  // Fetch all card sets only once using a ref flag
  const cardSetsFetchedRef = useRef(false);
  useEffect(() => {
    if (cardSetsFetchedRef.current) return;
    cardSetsFetchedRef.current = true;
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

  // Filter card sets for current user.
  const userCardSets = useMemo(() => {
    return currentUser
      ? cardSets.filter(cs => cs.createdBy && cs.createdBy.uid === currentUser.uid)
      : [];
  }, [cardSets, currentUser]);

  // Build calendar data for the selected month.
  useEffect(() => {
    const weeks = getCalendarData(userCardSets, calendarDate);
    setCalendarWeeks(weeks);
  }, [userCardSets, calendarDate]);

  // Calendar cell click handler for sets due.
  const handleCalendarCellClick = (cell: CalendarCell | null) => {
    if (cell && cell.setsDue.length > 0) {
      setSelectedDaySets(cell.setsDue);
      setShowCalendarDialog(true);
    }
  };

  // Handler for review badge click.
  const handleReviewBadgeClick = (cell: CalendarCell) => {
    const reviewSets = userCardSets.filter(
      cs => cs.lastReviewed && new Date(cs.lastReviewed).toDateString() === cell.date.toDateString()
    );
    if (reviewSets.length > 0) {
      setSelectedReviewSets(reviewSets);
      setShowReviewDialog(true);
    }
  };

  // Handlers for calendar month navigation.
  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };
  const handleCurrentMonth = () => {
    setCalendarDate(new Date());
  };

  // Get today's date string for comparison.
  const todayStr = new Date().toDateString();

  // --- New Code for Review Today and Missed Reviews ---

  // Calculate today's start and end timestamps.
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // Card sets with a next review scheduled for today.
  const reviewDueToday = useMemo(() => {
    return userCardSets.filter(cs => {
      const nextReview = getNextReviewTime(cs.lastReviewed, cs.reviewCount);
      return nextReview >= todayStart.getTime() && nextReview <= todayEnd.getTime();
    });
  }, [userCardSets]);

  // Card sets whose next review date is past (i.e. missed reviews).
  const missedReviews = useMemo(() => {
    return userCardSets.filter(cs => {
      const nextReview = getNextReviewTime(cs.lastReviewed, cs.reviewCount);
      return nextReview < todayStart.getTime();
    });
  }, [userCardSets]);

  if (authLoading) return <div>Loading...</div>;
  if (!currentUser) return <div>Please log in to view your dashboard.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Dashboard Header */}
        <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: '#0D005B' }}>{userName}'s Dashboard</h1>
        
        {/* Your Portfolio Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4">Your Portfolio</h2>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={userAvatar} alt="User avatar" />
                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{userName}</h3>
                    <p className="text-gray-500">Studying since: {creationDate}</p>
                  </div>
                </div>
                <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Edit Profile</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={userName} onChange={(e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)} className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bio" className="text-right">Bio</Label>
                        <Textarea id="bio" value={userBio} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setUserBio(e.target.value)} className="col-span-3" />
                      </div>
                    </div>
                    <Button onClick={handleProfileSave}>Save changes</Button>
                  </DialogContent>
                </Dialog>
              </div>
              {/* Last Logged In */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Users className="mr-2" />
                  Last Logged In
                </h2>
                <p className="text-gray-500">{lastLogin}</p>
              </div>
              {/* Your Plan */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4">Your Plan</h2>
                <p className="text-gray-500">Basic</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Upgrade to Pro
                </Button>
                <p className="text-xs text-gray-400 mt-1">to connect later</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review Calendar Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              {/* Left arrows */}
              <div className="flex items-center" style={{ width: '120px' }}>
                <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                  <ArrowLeft size={16} />
                </Button>
              </div>
              {/* Center header: Title + Month/Year */}
              <div className="text-center" style={{ width: '200px' }}>
                <div className="text-sm font-medium">Your Calendar</div>
                <div className="text-xs text-gray-500">
                  {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </div>
              </div>
              {/* Right arrows */}
              <div className="flex items-center justify-end" style={{ width: '120px' }}>
                <Button variant="outline" size="sm" onClick={handleNextMonth}>
                  <ArrowRight size={16} />
                </Button>
                <Button variant="outline" size="sm" onClick={handleCurrentMonth} className="ml-2">
                  Today
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
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
                      {week.map((cell, cIndex) => {
                        // Determine if this cell represents today.
                        const isToday = cell && cell.date.toDateString() === todayStr;
                        // Calculate the sets that were last reviewed on this day.
                        const reviewSets = cell
                          ? userCardSets.filter(
                              cs =>
                                cs.lastReviewed &&
                                new Date(cs.lastReviewed).toDateString() === cell.date.toDateString()
                            )
                          : [];
                        return (
                          <td
                            key={cIndex}
                            title={cell ? cell.date.toLocaleDateString() : ''}
                            className="border p-2 text-center"
                            style={{
                              width: '100px',
                              height: '100px',
                              verticalAlign: 'top',
                              cursor: cell && cell.setsDue.length > 0 ? 'pointer' : 'default',
                              position: 'relative'
                            }}
                            onClick={() => cell && handleCalendarCellClick(cell)}
                          >
                            {cell ? (
                              <div className="relative">
                                <div
                                  className={`font-semibold p-1 rounded-full inline-block ${isToday ? 'bg-blue-500 text-white' : ''}`}
                                >
                                  {cell.day}
                                </div>
                                {cell.setsDue.length > 0 && (
                                  <div className="mt-1 text-xs text-blue-600">
                                    {cell.setsDue.length} set{cell.setsDue.length > 1 ? 's' : ''}
                                  </div>
                                )}
                                {reviewSets.length > 0 && (
                                  <div className="mt-1">
                                    <span
                                      onClick={(e) => {
                                        // Prevent cell click event
                                        e.stopPropagation();
                                        handleReviewBadgeClick(cell);
                                      }}
                                      className="cursor-pointer inline-block bg-green-200 text-green-800 px-2 py-0.5 rounded-full text-xs"
                                    >
                                      Last review date of {reviewSets.length} set{reviewSets.length > 1 ? 's' : ''}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Dialog for Sets Due on This Day */}
            <Dialog open={showCalendarDialog} onOpenChange={setShowCalendarDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sets Due on This Day</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  {selectedDaySets.length === 0 ? (
                    <p>No sets due on this day.</p>
                  ) : (
                    <ul className="list-disc pl-5">
                      {selectedDaySets.map((cs) => (
                        <li key={cs.id} className="text-blue-600">{cs.title}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            {/* Dialog for Last Review Badge */}
            <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Last review date of {selectedReviewSets.length} set{selectedReviewSets.length > 1 ? 's' : ''}
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <ul className="list-disc pl-5">
                    {selectedReviewSets.map((cs) => (
                      <li key={cs.id} className="text-blue-600">{cs.title}</li>
                    ))}
                  </ul>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* New Section: Review Sessions Overview */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Review Sessions Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Column for Today's Reviews */}
                <div>
                  <h3 className="text-xl font-semibold mb-2">Review Today</h3>
                  {reviewDueToday.length === 0 ? (
                    <p className="text-gray-500">No reviews scheduled for today.</p>
                  ) : (
                    <ul className="list-disc pl-5">
                      {reviewDueToday.map(cs => (
                        <li key={cs.id} className="text-blue-600">{cs.title}</li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Column for Missed Reviews */}
                <div>
                  <h3 className="text-xl font-semibold mb-2">Missed Reviews</h3>
                  {missedReviews.length === 0 ? (
                    <p className="text-gray-500">No missed reviews.</p>
                  ) : (
                    <ul className="list-disc pl-5">
                      {missedReviews.map(cs => (
                        <li key={cs.id} className="text-red-600">{cs.title}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Flashcard Set Details Dialog */}
      <Dialog open={selectedSet !== null} onOpenChange={(open) => { if (!open) setSelectedSet(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSet?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            <p><strong>Description:</strong> {selectedSet?.description}</p>
            <p><strong>Last Reviewed:</strong> {formatDate(selectedSet?.lastReviewed)}</p>
            <p><strong>Review Count:</strong> {selectedSet?.reviewCount}</p>
            <p><strong>Next Review:</strong> {formatDate(getNextReviewTime(selectedSet?.lastReviewed, selectedSet?.reviewCount))}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default QuizletDashboard;
