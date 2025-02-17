

'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, UserCircle, Loader2 } from 'lucide-react'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function Navbar() {
  // Initialize user immediately from auth.currentUser
  const [user, setUser] = React.useState<User | null>(auth.currentUser)
  const [signOutLoading, setSignOutLoading] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
    })
    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      setSignOutLoading(true)
      await signOut(auth)
      router.push('/') // Redirect to home page after sign out
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setSignOutLoading(false)
    }
  }

  // Modify navItems based on authentication status
  const navItems = user
    ? [
        { name: 'Profile', href: '/profile' },
        { name: 'Settings', href: '/settings' },
        { name: 'Cards', href: '/cards' },
        { name: 'Test', href: '/tests' },
        { name: 'Create', href: '/create' },
      ]
    : []

  return (
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
              <Button key={item.name} variant="ghost" asChild>
                <Link href={item.href}>{item.name}</Link>
              </Button>
            ))}
            <Button variant="outline" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
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
            <Button variant="outline" size="sm" className="mr-2 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
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
                    <Link href={item.href}>{item.name}</Link>
                  </DropdownMenuItem>
                ))}
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
  )
}

