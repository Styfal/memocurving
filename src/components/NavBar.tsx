'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, UserCircle, Loader2 } from 'lucide-react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CardSet {
  id: string;
  title: string;
  lastReviewed: number;
  reviewCount: number;
  createdBy: {
    uid: string;
    [key: string]: any;
  };
}

export default function Navbar() {
  // Initialize user immediately from auth.currentUser
  const [user, setUser] = React.useState<User | null>(auth.currentUser);
  const [signOutLoading, setSignOutLoading] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname(); // current URL path

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      setSignOutLoading(true);
      await signOut(auth);
      router.push('/'); // Redirect to home page after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setSignOutLoading(false);
    }
  };

  // Define navItems for non-create pages
  const navItems = user
    ? [
        { name: 'Profile', href: '/profile' },
        { name: 'Settings', href: '/settings' },
        { name: 'Cards', href: '/cards' },
        { name: 'Test', href: '/tests' },
      ]
    : [];

  // Active/inactive classes
  const activeClasses = 'bg-[#0D005B] text-white';
  const navInactiveClasses = 'bg-transparent text-black';
  const pricingInactiveClasses = 'bg-primary text-primary-foreground hover:bg-primary/90';

  // --- Code for Review Sessions Notifications ---

  // State for storing card sets fetched from the API
  const [cardSets, setCardSets] = React.useState<CardSet[]>([]);
  // States to control visibility of notifications
  const [showReviewToday, setShowReviewToday] = React.useState(false);
  const [showMissedReviews, setShowMissedReviews] = React.useState(false);
  // States to control flash effect (after 5 minutes)
  const [flashReviewToday, setFlashReviewToday] = React.useState(false);
  const [flashMissedReviews, setFlashMissedReviews] = React.useState(false);

  // Load the in‑app notifications setting from localStorage (set via settings page)
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  React.useEffect(() => {
    const stored = localStorage.getItem("pushNotificationsEnabled");
    if (stored !== null) {
      setNotificationsEnabled(JSON.parse(stored));
    }
  }, []);

  // Function to fetch card sets from the API
  const fetchCardSets = async () => {
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
  };

  // Fetch card sets on mount and whenever the user is authenticated.
  React.useEffect(() => {
    if (user) {
      fetchCardSets();
    }
  }, [user]);

  // Filter card sets for current user.
  const userCardSets = React.useMemo(() => {
    return user ? cardSets.filter((cs) => cs.createdBy && cs.createdBy.uid === user.uid) : [];
  }, [cardSets, user]);

  // Utility function: getNextReviewTime.
  const getNextReviewTime = (lastReviewed: number, reviewCount: number): number => {
    const msPerDay = 1000 * 60 * 60 * 24;
    if (lastReviewed === 0) return Date.now() + msPerDay;
    return lastReviewed + (reviewCount + 1) * msPerDay;
  };

  // Calculate today's start and end timestamps.
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // Card sets with a next review scheduled for today.
  const reviewDueToday = React.useMemo(() => {
    return userCardSets.filter((cs) => {
      const nextReview = getNextReviewTime(cs.lastReviewed, cs.reviewCount);
      return nextReview >= todayStart.getTime() && nextReview <= todayEnd.getTime();
    });
  }, [userCardSets]);

  // Card sets whose next review date is past (i.e. missed reviews).
  const missedReviews = React.useMemo(() => {
    return userCardSets.filter((cs) => {
      const nextReview = getNextReviewTime(cs.lastReviewed, cs.reviewCount);
      return nextReview < todayStart.getTime();
    });
  }, [userCardSets]);

  // Update the "Review Today" notification whenever reviewDueToday changes.
  React.useEffect(() => {
    if (reviewDueToday.length > 0) {
      setShowReviewToday(true);
      setFlashReviewToday(false);
    } else {
      setShowReviewToday(false);
      setFlashReviewToday(false);
    }
  }, [reviewDueToday]);

  // Update the "Missed Reviews" notification whenever missedReviews changes.
  React.useEffect(() => {
    if (missedReviews.length > 0) {
      setShowMissedReviews(true);
      setFlashMissedReviews(false);
    } else {
      setShowMissedReviews(false);
      setFlashMissedReviews(false);
    }
  }, [missedReviews]);

  // Trigger flash effect after 5 minutes if a notification is still visible.
  React.useEffect(() => {
    let flashTimeout1: NodeJS.Timeout;
    if (showReviewToday) {
      flashTimeout1 = setTimeout(() => {
        setFlashReviewToday(true);
      }, 300000); // 5 minutes
    }
    return () => flashTimeout1 && clearTimeout(flashTimeout1);
  }, [showReviewToday]);

  React.useEffect(() => {
    let flashTimeout2: NodeJS.Timeout;
    if (showMissedReviews) {
      flashTimeout2 = setTimeout(() => {
        setFlashMissedReviews(true);
      }, 300000); // 5 minutes
    }
    return () => flashTimeout2 && clearTimeout(flashTimeout2);
  }, [showMissedReviews]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/textless-logo.svg"
                  alt="MEMOCURVE Logo"
                  width={250}
                  height={50}
                  className="object-contain"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  asChild
                  className={pathname === item.href ? activeClasses : navInactiveClasses}
                >
                  <Link href={item.href}>{item.name}</Link>
                </Button>
              ))}

              {/* Dropdown for "Create" (only visible when authenticated) */}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={pathname.startsWith('/create') ? activeClasses : navInactiveClasses}
                    >
                      Create
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/create/cardset"
                        className={pathname === '/create/cardset' ? activeClasses : navInactiveClasses}
                      >
                        Create Card Set
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/create/test"
                        className={pathname === '/create/test' ? activeClasses : navInactiveClasses}
                      >
                        Test Create
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/create/ai"
                        className={pathname === '/create/ai' ? activeClasses : navInactiveClasses}
                      >
                        AI Create
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Button
                variant="outline"
                asChild
                className={pathname === '/pricing' ? activeClasses : pricingInactiveClasses}
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
              {user ? (
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                  disabled={signOutLoading}
                >
                  {signOutLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <UserCircle className="h-5 w-5" />
                  )}
                  Sign Out
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  asChild
                >
                  <Link href="/login">Sign In</Link>
                </Button>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="flex items-center md:hidden">
              <Button
                variant="outline"
                size="sm"
                asChild
                className={pathname === '/pricing' ? activeClasses : pricingInactiveClasses}
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  {navItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link
                        href={item.href}
                        className={pathname === item.href ? activeClasses : navInactiveClasses}
                      >
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  {/* Mobile "Create" Options (only visible when authenticated) */}
                  {user && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/create/cardset"
                          className={pathname === '/create/cardset' ? activeClasses : navInactiveClasses}
                        >
                          Create Card Set
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/create/test"
                          className={pathname === '/create/test' ? activeClasses : navInactiveClasses}
                        >
                          Test Create
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/create/ai"
                          className={pathname === '/create/ai' ? activeClasses : navInactiveClasses}
                        >
                          AI Create
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {user ? (
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      disabled={signOutLoading}
                      className="flex items-center gap-2"
                    >
                      {signOutLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserCircle className="h-4 w-4" />
                      )}
                      Sign Out
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href="/login">Sign In</Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Popup Notifications for Review Sessions */}
      {notificationsEnabled && ((showReviewToday && reviewDueToday.length > 0) ||
        (showMissedReviews && missedReviews.length > 0)) && (
        <div className="fixed" style={{ top: '70px', right: '20px', zIndex: 1000 }}>
          {showReviewToday && reviewDueToday.length > 0 && (
            <div
              className={`bg-white shadow-lg p-4 mb-2 max-w-xs rounded-lg slide-in transition-transform duration-500 ${
                flashReviewToday ? 'flash' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <h4 className="font-bold">Review Today</h4>
                <button
                  onClick={() => {
                    setShowReviewToday(false);
                    setFlashReviewToday(false);
                  }}
                  className="text-gray-500 text-2xl leading-none"
                >
                  &times;
                </button>
              </div>
              <ul className="mt-2 list-disc pl-5">
                {reviewDueToday.map((cs) => (
                  <li key={cs.id} className="text-blue-600 text-sm">
                    {cs.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {showMissedReviews && missedReviews.length > 0 && (
            <div
              className={`bg-white shadow-lg p-4 mb-2 max-w-xs rounded-lg slide-in transition-transform duration-500 ${
                flashMissedReviews ? 'flash' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <h4 className="font-bold">Missed Reviews</h4>
                <button
                  onClick={() => {
                    setShowMissedReviews(false);
                    setFlashMissedReviews(false);
                  }}
                  className="text-gray-500 text-2xl leading-none"
                >
                  &times;
                </button>
              </div>
              <ul className="mt-2 list-disc pl-5">
                {missedReviews.map((cs) => (
                  <li key={cs.id} className="text-red-600 text-sm">
                    {cs.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .slide-in {
          animation: slideIn 0.5s ease-out;
        }
        @keyframes flash {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .flash {
          animation: flash 1s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
