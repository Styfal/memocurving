import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuthState } from "react-firebase-hooks/auth";
import { Auth } from "firebase/auth";
import {auth} from "../lib/firebase";
import { useRouter } from "next/navigation";



export function Courses() {

  return (
    <div className="w-full min-h-screen bg-background">
      <header className="py-12 px-4 md:px-6">
      <div className="container max-w-5xl mx-auto space-y-4 text-center">
        <div className="flex justify-center">
           <img src="/path-to-your-icon.svg" alt="Icon" className="h-10 w-10" />
              </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                   <span className="bg-cyan-500 text-white px-2"> Explore</span> Flashcards
               </h1>
                 <p className="text-muted-foreground md:text-xl">
                   Start Studying Efficently 
                </p>
            </div>
      </header>
      <main className="py-12 px-4 md:px-6">
        <div className="container max-w-5xl mx-auto">
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold"> Your Cards </h2>
              <Link href="/courses/flashcard01">
                <Button variant="link" className="text-primary">
                  View more 
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out">
                <img
                  src="/placeholder.svg"
                  alt="HTML and CSS"
                  width={600}
                  height={300}
                  className="object-cover w-full h-48"
                  style={{ aspectRatio: "600/300", objectFit: "cover" }}
                />
                <Link href="/cards/flashcard03" className="absolute inset-0 z-10" prefetch={false}>
                  <span className="sr-only">Economics</span>
                </Link>
                <div className="p-6 bg-background">
                  <h3 className="text-xl font-bold">What is a market</h3>
                  <p className="text-muted-foreground mt-2">
                    Microeconomics 1 
                  </p>
                  <Link href="/cards/flashcard03">
                    <Button size="sm" className="mt-4">
                      Start
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out">
                <img
                  src="/placeholder.svg"
                  alt="JavaScript Essentials"
                  width={600}
                  height={300}
                  className="object-cover w-full h-48"
                  style={{ aspectRatio: "600/300", objectFit: "cover" }}
                />
                <Link href="/courses/flashcard01" className="absolute inset-0 z-10" prefetch={false}>
                  <span className="sr-only">Biology 1</span>
                </Link>
                <div className="p-6 bg-background">
                  <h3 className="text-xl font-bold">Biology 1</h3>
                  <p className="text-muted-foreground mt-2">
                   Biology 1 at SILS, understand mechanical motion, nerve structure, etc. 
                  </p>
                  <Link href="/courses/flashcard05">
                    <Button size="sm" className="mt-4">
                      Start
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out">
                <img
                  src="/placeholder.svg"
                  alt="React.js Fundamentals"
                  width={600}
                  height={300}
                  className="object-cover w-full h-48"
                  style={{ aspectRatio: "600/300", objectFit: "cover" }}
                />
                <Link href="/courses/flashcard06" className="absolute inset-0 z-10" prefetch={false}>
                  <span className="sr-only">Importance of Investments</span>
                </Link>
                <div className="p-6 bg-background">
                  <h3 className="text-xl font-bold">Table Tennis</h3>
                  <p className="text-muted-foreground mt-2">
                     Ping-Pong Techniques, Backspin, Frontspin, Deflection, Serve, Etc
                  </p>
                  <Link href="/courses/flashcard07">
                    <Button size="sm" className="mt-4">
                      Start
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Global Cards</h2>
              <Link href="/courses/data-science">
                <Button variant="link" className="text-primary">
                  Explore More
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out">
                <img
                  src="/placeholder.svg"
                  alt="Python for Data Analysis"
                  width={600}
                  height={300}
                  className="object-cover w-full h-48"
                  style={{ aspectRatio: "600/300", objectFit: "cover" }}
                />
                <Link href="/courses/data-science/python-for-data-analysis" className="absolute inset-0 z-10" prefetch={false}>
                  <span className="sr-only">What is a Stock</span>
                </Link>
                <div className="p-6 bg-background">
                  <h3 className="text-xl font-bold">What is a Stock?</h3>
                  <p className="text-muted-foreground mt-2">
                    how do stocks play a role in our investments? What types of stocks exist? How would an beginner invester like me to choose to invest in a particular stock? 
                  </p>
                  <Link href="/courses/data-science/python-for-data-analysis">
                    <Button size="sm" className="mt-4">
                      Start
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out">
                <img
                  src="/placeholder.svg"
                  alt="Machine Learning Fundamentals"
                  width={600}
                  height={300}
                  className="object-cover w-full h-48"
                  style={{ aspectRatio: "600/300", objectFit: "cover" }}
                />
                <Link href="/courses/data-science/machine-learning-fundamentals" className="absolute inset-0 z-10" prefetch={false}>
                  <span className="sr-only">Market Fluctuations</span>
                </Link>
                <div className="p-6 bg-background">
                  <h3 className="text-xl font-bold">Market Fluctuations</h3>
                  <p className="text-muted-foreground mt-2">
                  Learn the types of occurences that influence stock prives and how that is illustrated graphically. 
                  </p>
                  <Link href="/courses/data-science/machine-learning-fundamentals">
                    <Button size="sm" className="mt-4">
                      Start
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out">
                <img
                  src="/placeholder.svg"
                  alt="Data Visualization with Tableau"
                  width={600}
                  height={300}
                  className="object-cover w-full h-48"
                  style={{ aspectRatio: "600/300", objectFit: "cover" }}
                />
                <Link href="/courses/data-science/data-visualization-with-tableau" className="absolute inset-0 z-10" prefetch={false}>
                  <span className="sr-only">Indices and Stocks</span>
                </Link>
                <div className="p-6 bg-background">
                  <h3 className="text-xl font-bold">Indices and Stocks</h3>
                  <p className="text-muted-foreground mt-2">
                    What is an index and how is that related with stocks? How do traders usually behave when it comes to investing in indices. 
                  </p>
                  <Link href="/courses/data-science/data-visualization-with-tableau">
                    <Button size="sm" className="mt-4">
                      Start
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
