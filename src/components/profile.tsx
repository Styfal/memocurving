// import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
// import Link from "next/link"
// import { Input } from "@/components/ui/input"
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
// import { Button } from "@/components/ui/button"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
// import { Separator } from "@/components/ui/separator"

// // Unused, will be removed 


// export function Profile() {
//   return (
//     <div className="flex flex-col w-full min-h-screen">
//       <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 bg-white px-4 sm:static sm:h-auto sm:bg-transparent sm:px-6 mt-8">
//   <Breadcrumb className="hidden md:flex">
//     <BreadcrumbList>
//       <BreadcrumbItem>
//         <BreadcrumbLink asChild>
//           <Link href="#" prefetch={false}>
//             Report
//           </Link>
//         </BreadcrumbLink>
//       </BreadcrumbItem>
//     </BreadcrumbList>
//   </Breadcrumb>
//   <div className="flex items-center gap-4">
//     <div className="relative flex-1 md:w-auto">
//       <div className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500" />
//       <Input
//         type="search"
//         placeholder="Search..."
//         className="w-full rounded-lg bg-white pl-10 pr-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 md:w-[240px] lg:w-[400px]"
//       />
//     </div>
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
//           <img
//             src="/placeholder.svg"
//             width={40}
//             height={40}
//             alt="Avatar"
//             className="overflow-hidden rounded-full"
//             style={{ aspectRatio: "40/40", objectFit: "cover" }}
//           />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuLabel>My Account</DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem>Settings</DropdownMenuItem>
//         <DropdownMenuItem>Support</DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem>Logout</DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   </div>
// </header>
//       <main className="grid flex-1 items-start gap-6 p-6 sm:px-8 sm:py-4 md:gap-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <Card className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 rounded-lg shadow-lg border border-blue-500">
//             <CardHeader className="flex flex-row items-center justify-between pb-4">
//               <CardTitle className="text-lg font-semibold">Recent News</CardTitle>
//               <Link href="#" className="text-green-500 hover:underline" prefetch={false}>
//                 View All
//               </Link>
//             </CardHeader>
//             <CardContent>
//               <div className="grid gap-6">
//                 <div className="grid gap-3">
//                   <div className="text-xl font-semibold">Federal Reserve Raises Interest Rates Again</div>
//                   <div className="text-gray-600">
//                     The Federal Reserve has announced another interest rate hike, citing continued inflationary
//                     pressures.
//                   </div>
//                 </div>
//                 <div className="grid gap-3">
//                   <div className="text-xl font-semibold">Cryptocurrency Prices Surge Amid Market Optimism</div>
//                   <div className="text-gray-600">
//                     Major cryptocurrencies have seen a significant increase in value, driven by positive market
//                     sentiment.
//                   </div>
//                 </div>
//                 <div className="grid gap-3">
//                   <div className="text-xl font-semibold">New Regulations Proposed for the Investment Industry</div>
//                   <div className="text-gray-600">
//                     Lawmakers are considering new regulations to enhance transparency and consumer protection in the
//                     investment sector.
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <div className="grid grid-cols-1 gap-6">
//             <Card className="rounded-lg shadow-lg border border-blue-500">
//               <CardHeader className="flex flex-row items-center justify-between pb-4">
//                 <CardTitle className="text-lg font-semibold">Courses to Continue</CardTitle>
//                 <Link href="#" className="text-green-500 hover:underline" prefetch={false}>
//                   View All
//                 </Link>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid gap-6">
//                   <div className="grid gap-3">
//                     <div className="flex items-center justify-between">
//                       <div className="text-sm font-medium">Introduction to Investing</div>
//                       <div className="text-sm font-medium">75%</div>
//                     </div>
//                     <Progress value={75} aria-label="75% complete" className="rounded-full" />
//                     <Button size="sm" className="w-full rounded-full bg-green-500 text-white hover:bg-green-600">
//                       Continue
//                     </Button>
//                   </div>
//                   <div className="grid gap-3">
//                     <div className="flex items-center justify-between">
//                       <div className="text-sm font-medium">Fundamentals of Stock Trading</div>
//                       <div className="text-sm font-medium">50%</div>
//                     </div>
//                     <Progress value={50} aria-label="50% complete" className="rounded-full" />
//                     <Button size="sm" className="w-full rounded-full bg-green-500 text-white hover:bg-green-600">
//                       Continue
//                     </Button>
//                   </div>
//                   <div className="grid gap-3">
//                     <div className="flex items-center justify-between">
//                       <div className="text-sm font-medium">Cryptocurrency Investing 101</div>
//                       <div className="text-sm font-medium">30%</div>
//                     </div>
//                     <Progress value={30} aria-label="30% complete" className="rounded-full" />
//                     <Button size="sm" className="w-full rounded-full bg-green-500 text-white hover:bg-green-600">
//                       Continue
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//           <Card className="rounded-lg shadow-lg border border-blue-500">
//             <CardHeader className="flex flex-row items-center justify-between pb-4">
//               <CardTitle className="text-lg font-semibold">Profile</CardTitle>
//               <Link href="#" className="text-green-500 hover:underline" prefetch={false}>
//                 Edit
//               </Link>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center gap-6">
//                 <Avatar className="h-20 w-20 border-4">
//                   <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
//                   <AvatarFallback>JD</AvatarFallback>
//                 </Avatar>
//                 <div className="grid gap-2">
//                   <div className="text-xl font-semibold">Koji Iwata</div>
//                   <div className="text-gray-600">Investor</div>
//                 </div>
//               </div>
//               <Separator className="my-6" />
//               <div className="grid gap-4">
//                 <div className="flex items-center justify-between">
//                   <div className="text-sm font-medium">Email</div>
//                   <div className="text-sm text-gray-600">ilovelebron@example.com</div>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="text-sm font-medium">Phone</div>
//                   <div className="text-sm text-gray-600">+1 (555) 555-5555</div>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="text-sm font-medium">Location</div>
//                   <div className="text-sm text-gray-600">New York, USA</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     </div>
//   )
// }


import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export function Profile() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 bg-white px-4 sm:static sm:h-auto sm:bg-transparent sm:px-6 mt-8">
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="#" prefetch={false}>
                  Report
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 md:w-auto">
            <div className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-white pl-10 pr-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 md:w-[240px] lg:w-[400px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg"
                  width={40}
                  height={40}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                  style={{ objectFit: "cover" }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="grid flex-1 items-start gap-6 p-6 sm:px-8 sm:py-4 md:gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 rounded-lg shadow-lg border border-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Recent News</CardTitle>
              <Link href="#" className="text-green-500 hover:underline" prefetch={false}>
                View All
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <div className="text-xl font-semibold">Federal Reserve Raises Interest Rates Again</div>
                  <div className="text-gray-600">
                    The Federal Reserve has announced another interest rate hike, citing continued inflationary pressures.
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="text-xl font-semibold">Cryptocurrency Prices Surge Amid Market Optimism</div>
                  <div className="text-gray-600">
                    Major cryptocurrencies have seen a significant increase in value, driven by positive market sentiment.
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="text-xl font-semibold">New Regulations Proposed for the Investment Industry</div>
                  <div className="text-gray-600">
                    Lawmakers are considering new regulations to enhance transparency and consumer protection in the investment sector.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 gap-6">
            <Card className="rounded-lg shadow-lg border border-blue-500">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-semibold">Courses to Continue</CardTitle>
                <Link href="#" className="text-green-500 hover:underline" prefetch={false}>
                  View All
                </Link>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Introduction to Investing</div>
                      <div className="text-sm font-medium">75%</div>
                    </div>
                    <Progress value={75} aria-label="75% complete" className="rounded-full" />
                    <Button size="sm" className="w-full rounded-full bg-green-500 text-white hover:bg-green-600">
                      Continue
                    </Button>
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Fundamentals of Stock Trading</div>
                      <div className="text-sm font-medium">50%</div>
                    </div>
                    <Progress value={50} aria-label="50% complete" className="rounded-full" />
                    <Button size="sm" className="w-full rounded-full bg-green-500 text-white hover:bg-green-600">
                      Continue
                    </Button>
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Cryptocurrency Investing 101</div>
                      <div className="text-sm font-medium">30%</div>
                    </div>
                    <Progress value={30} aria-label="30% complete" className="rounded-full" />
                    <Button size="sm" className="w-full rounded-full bg-green-500 text-white hover:bg-green-600">
                      Continue
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="rounded-lg shadow-lg border border-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Profile</CardTitle>
              <Link href="#" className="text-green-500 hover:underline" prefetch={false}>
                Edit
              </Link>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-4">
                  <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="grid gap-2">
                  <div className="text-xl font-semibold">Koji Iwata</div>
                  <div className="text-gray-600">Investor</div>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-sm text-gray-600">ilovelebron@example.com</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Phone</div>
                  <div className="text-sm text-gray-600">+1 (555) 555-5555</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Location</div>
                  <div className="text-sm text-gray-600">New York, USA</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
