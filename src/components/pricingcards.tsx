import { Button } from "@/components/ui/button"
import Link from "next/link"

// Need to setup stripe. Anish (Me) will work on this so not to worry!

export function PricingCards() {
  return (
    <section className="min-h-screen w-full py-12 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 flex items-start justify-center">
      <div className="container px-4 md:px-6">
        <div className="grid gap-4 md:gap-8">
          <div className="grid gap-2">
            <h1 className="text-3xl font-bold text-center" style={{ color: '#0D005B' }}>Upgrade Plan</h1>
            <p className="text-muted-foreground text-center">
              Accelerate your learning even further with extension features!
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3 md:gap-8">
            {/* Basic (Free) Card */}
            <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg dark:bg-zinc-850 border border-gray-300 transition-transform duration-300 hover:scale-105">
              <div className="flex flex-col flex-grow">
                <div className="flex items-center justify-center mb-4">
                  <RocketIcon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-center">Basic (Free)</h3>
                  <div className="mt-4 text-center text-zinc-600 dark:text-zinc-400">
                    <span className="text-4xl font-bold">Free</span>
                  </div>
                  <p className="mt-4 text-center text-zinc-600 dark:text-zinc-400">
                    beta testing
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Link href="/cart">
                  <Button className="w-full max-w-[200px] h-[40px] transition-transform duration-300 hover:scale-105">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>

            {/* Pro Card */}
            <div className="relative flex flex-col p-6 bg-white shadow-lg rounded-lg dark:bg-zinc-850 border border-green-500 transition-transform duration-300 hover:scale-105">
              <div className="flex flex-col flex-grow">
                <div className="flex items-center justify-center mb-4">
                  <RocketIcon className="h-8 w-8 text-primary" />
                </div>
                <div className="px-3 py-1 text-sm text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full inline-block absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  Popular
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-center">Pro</h3>
                  <div className="mt-4 text-center text-zinc-600 dark:text-zinc-400">
                    <span className="text-4xl font-bold">400 yen</span> / month
                  </div>
                  <p className="mt-4 text-center text-zinc-600 dark:text-zinc-400">
                    to be announced...
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Link href="/cart">
                  <Button className="w-full max-w-[200px] h-[40px] bg-gradient-to-r from-green-500 to-blue-500 transition-transform duration-300 hover:scale-105">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>

            {/* Enterprise Card */}
            <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg dark:bg-zinc-850 border border-gray-300 transition-transform duration-300 hover:scale-105">
              <div className="flex flex-col flex-grow">
                <div className="flex items-center justify-center mb-4">
                  <RocketIcon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-center">Enterprise</h3>
                  <div className="mt-4 text-center text-zinc-600 dark:text-zinc-400">
                    <span className="text-4xl font-bold">to be announced...</span>
                  </div>
                  <p className="mt-4 text-center text-zinc-600 dark:text-zinc-400">
                    to be announced...
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Link href="/contact">
                  <Button className="w-full max-w-[200px] h-[40px] transition-transform duration-300 hover:scale-105">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function RocketIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  )
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
