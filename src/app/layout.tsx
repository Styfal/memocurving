
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Provider from "./_trpc/Provider";
import Navbar from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Memocurve",
  description: "Beta Memocurve",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} m-0`}>
        <Provider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="pt-10 flex-1">{children}</main>
            <Toaster />
            <Footer />
          </div>
        </Provider>
      </body>
    </html>
  );
}
