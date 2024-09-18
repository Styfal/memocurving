'use client';

import { useState } from 'react';
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { ArrowRight, Settings, User, BookText } from "lucide-react"; 
import { LogoutLink, RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const NavBar = () => {
  const { user, isLoading } = useKindeBrowserClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const iconClass = "h-5 w-5"; 

  return (
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            Memo<span className="text-blue-600">curve</span>
          </Link>

          <div className="ml-auto h-full flex items-center space-x-4 relative">
            {!isLoading && user ? (
              <>
                <Link
                  href="/cards"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  <BookText className={iconClass} />
                </Link>

              
                <div className="relative">
                  <User 
                    className={`${iconClass} text-gray-600 hover:text-gray-900 cursor-pointer`}
                    onClick={toggleDropdown}
                  />

                
                  <div 
                    className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg transition-all duration-300 ${
                      isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
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
                    Dashboard
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