

'use client';

import React, { useEffect, useState, ChangeEvent, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { BookOpen, Users, Upload } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

//
// Helper Functions
//

// Format a timestamp as "DD MMM YYYY"
const formatDate = (timestamp: number): string => {
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

const getCalendarData = (sets: CardSet[]): (CalendarCell | null)[][] => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
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

interface TableRowData {
  id: string;
  title: string;
  lastReviewed: string;
  reviewCount: number;
  nextReview: string;
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
  const [updating, setUpdating] = useState<boolean>(false);
  const [calendarWeeks, setCalendarWeeks] = useState<(CalendarCell | null)[][]>([]);
  const [selectedDaySets, setSelectedDaySets] = useState<CardSet[]>([]);
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);

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

  // Handle avatar changes (temporarily commented out)
//   const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const result = reader.result;
//         if (typeof result === 'string') {
//           setUserAvatar(result);
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

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

  // Fetch all card sets
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

  // Filter card sets for current user.
  const userCardSets = useMemo(() => {
    return currentUser
      ? cardSets.filter(cs => cs.createdBy && cs.createdBy.uid === currentUser.uid)
      : [];
  }, [cardSets, currentUser]);

  // Build table data for flashcard sets.
  const tableData: TableRowData[] = userCardSets.map(cs => {
    const lastReviewedStr = formatDate(cs.lastReviewed);
    const nextReviewTime = getNextReviewTime(cs.lastReviewed, cs.reviewCount);
    const nextReviewStr = formatDate(nextReviewTime);
    return {
      id: cs.id,
      title: cs.title,
      lastReviewed: lastReviewedStr,
      reviewCount: cs.reviewCount,
      nextReview: nextReviewStr,
    };
  });

  // Handler: Finish review session.
  const finishReviewSession = async (id: string) => {
    const cs = userCardSets.find(set => set.id === id);
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
        setCardSets(prev => prev.map(set => set.id === id ? updatedSet : set));
      }
    } catch (error) {
      console.error('Error updating card set:', error);
    }
    setUpdating(false);
  };

  // Build calendar data for current month.
  useEffect(() => {
    const weeks = getCalendarData(userCardSets);
    setCalendarWeeks(weeks);
  }, [userCardSets]);

  // Calendar cell click handler.
  const handleCalendarCellClick = (cell: CalendarCell | null) => {
    if (cell && cell.setsDue.length > 0) {
      setSelectedDaySets(cell.setsDue);
      setShowCalendarDialog(true);
    }
  };

  if (authLoading) return <div>Loading...</div>;
  if (!currentUser) return <div>Please log in to view your dashboard.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Dashboard Header */}
        <h1 className="text-4xl font-bold mb-8 text-center text-cyan-800">{userName}'s Dashboard</h1>
        
        {/* My Flashcard Sets Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2" />
              My Flashcard Sets
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userCardSets.length === 0 ? (
              <p>No flashcard sets found for your account.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
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
          </CardContent>
        </Card>
        
        {/* Your Portfolio Section (unchanged) */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
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
                      {/* Avatar upload is temporarily commented out */}
                      {/*
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="picture" className="text-right">Picture</Label>
                        <div className="col-span-3">
                          <Label htmlFor="picture" className="cursor-pointer">
                            <div className="flex items-center space-x-2 border rounded p-2">
                              <Upload className="h-4 w-4" />
                              <span>Upload new picture</span>
                            </div>
                          </Label>
                          <Input id="picture" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </div>
                      </div>
                      */}
                    </div>
                    <Button onClick={handleProfileSave}>Save changes</Button>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Users className="mr-2" />
                  Last Logged In
                </h2>
                <p className="text-gray-500">{lastLogin}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review Calendar Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2" />
              Review Calendar
            </CardTitle>
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
                      {week.map((cell, cIndex) => (
                        <td
                          key={cIndex}
                          className="border p-2 text-center"
                          style={{ width: '100px', height: '100px', verticalAlign: 'top', cursor: cell && cell.setsDue.length > 0 ? 'pointer' : 'default' }}
                          onClick={() => cell && handleCalendarCellClick(cell)}
                        >
                          {cell ? (
                            <div>
                              <div className="font-semibold">{cell.day}</div>
                              {cell.setsDue.length > 0 && (
                                <div className="mt-1 text-xs text-blue-600">
                                  {cell.setsDue.length} set{cell.setsDue.length > 1 ? 's' : ''}
                                </div>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default QuizletDashboard;
