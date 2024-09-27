'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { ArrowRight, Settings, User, BookText, LayoutDashboard, ChevronDown } from "lucide-react"; 
import { LogoutLink, RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

type DropdownType = 'bookText' | 'user' | null;

const NavBar: React.FC = () => {
  const { user, isLoading } = useKindeBrowserClient();
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const toggleDropdown = (dropdown: DropdownType) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const iconClass = "h-5 w-5"; 

  return (
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <div className="flex flex row">
        
          </div>
          <Link href="/" className="flex z-40 font-bold text-[18px]">
            Memo<span className="text-blue-600">curve</span>
          </Link>

          <div className="ml-auto h-full flex items-center space-x-4 relative" ref={dropdownRef}>
            {!isLoading && user ? (
              <>
                <div className="relative">
                  <div 
                    className={`flex items-center ${buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })} cursor-pointer`}
                    onClick={() => toggleDropdown('bookText')}
                  >
                    <BookText className={iconClass} />
                    <ChevronDown className={`${iconClass} ml-1 transition-transform duration-200 ${activeDropdown === 'bookText' ? 'rotate-180' : ''}`} />
                  </div>

                  <div 
                    className={`absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg transition-all duration-300 ${
                      activeDropdown === 'bookText' ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                  >
                    <Link
                      href="/cards"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Cards
                    </Link>
                    <Link
                      href="/create"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Create
                    </Link>
                    <Link
                      href="/faq"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      FAQ
                    </Link>
                  </div>
                </div>

                <div className="relative">
                  <div 
                    className={`flex items-center ${buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })} cursor-pointer`}
                    onClick={() => toggleDropdown('user')}
                  >
                    <User className={iconClass} />
                    <ChevronDown className={`${iconClass} ml-1 transition-transform duration-200 ${activeDropdown === 'user' ? 'rotate-180' : ''}`} />
                  </div>

                  <div 
                    className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg transition-all duration-300 ${
                      activeDropdown === 'user' ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <LoginLink className='block px-4 py-2 text-gray-700 hover:bg-gray-100'>
                      Add Account 
                    </LoginLink>
                    <LogoutLink className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Logout
                    </LogoutLink>
                  </div>
                </div>

                {isAdmin && (
                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    <LayoutDashboard className={iconClass} />
                  </Link>
                )}
           
                <Link
                  href="/settings"
                  className={`text-gray-600 hover:text-gray-900 ${buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}`}
                >
                  <Settings className={iconClass} />
                </Link>

                <Link
                  href="/pricing"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  View Pricing
                  <ArrowRight className={iconClass} />
                </Link>
              </>
            ) : (
              <>
                <RegisterLink
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Join
                </RegisterLink>
                <LoginLink
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Login
                </LoginLink>

                <div className="h-8 w-px bg-zinc-200 hidden sm:block" />

                <Link
                  href="/pricing"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  View Pricing
                  <ArrowRight className={iconClass} />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default NavBar;