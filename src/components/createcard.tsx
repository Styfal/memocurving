
// "use client";

// import { useState, useEffect, SetStateAction } from 'react';
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import CreateCardSet from './create-card-set';
// import EditCardSets from './edit-card-sets';
// import TestCreate from './test-create';
// import AICreate from './ai-create';

// interface Flashcard {
//   id: number;
//   question: string;
//   answer: string;
//   image: string | null;
// }

// interface CardSet {
//   id: number;
//   name: string;
//   description: string;
//   cards: Flashcard[];
// }

// interface TestQuestion {
//   id: number;
//   question: string;
//   answerType: 'multiple' | 'short';
//   options?: string[];
//   correctAnswer: string;
//   image: string | null;
// }

// interface TestSet {
//   id: number;
//   name: string;
//   description: string;
//   questions: TestQuestion[];
// }

// // New combined type
// type CombinedSet = CardSet | TestSet;

// export default function CreateCards() {
//   const [cardSets, setCardSets] = useState<CardSet[]>([]);
//   const [testSets, setTestSets] = useState<TestSet[]>([]);
//   const [combinedSets, setCombinedSets] = useState<CombinedSet[]>([]); // New state for combined sets
//   const [currentPage, setCurrentPage] = useState('create');
//   const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => setNotification(null), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   useEffect(() => {
//     // Update the combinedSets whenever cardSets or testSets change
//     setCombinedSets([...cardSets, ...testSets]);
//   }, [cardSets, testSets]);

//   const renderContent = () => {
//     switch (currentPage) {
//       case 'create':
//         return <CreateCardSet setCardSets={setCardSets} setNotification={setNotification} />;
//       case 'edit':
//         return (
//           <EditCardSets
//             combinedSets={combinedSets}
//             setCardSets={setCardSets}
//             setNotification={setNotification}
//           />
//         );
//       case 'test':
//         return <TestCreate setTestSets={setTestSets} setNotification={setNotification} />;
//       case 'ai':
//         return <AICreate />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
//       <div className="flex-1 p-8 overflow-auto">
//         <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: '#0D005B' }}>
//           {currentPage === 'create'
//             ? 'Create Card Set'
//             : currentPage === 'edit'
//             ? 'Edit Card Sets'
//             : currentPage === 'test'
//             ? 'Test Create'
//             : currentPage === 'ai'
//             ? 'AI Create'
//             : ''}
//         </h1>
//         {notification && (
//           <Alert variant={notification.type === 'success' ? 'default' : 'destructive'} className="mb-4">
//             <AlertTitle>{notification.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
//             <AlertDescription>{notification.message}</AlertDescription>
//           </Alert>
//         )}
//         {renderContent()}
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useEffect, SetStateAction } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import CreateCardSet from "./create-card-set";
import EditCardSets from "./edit-card-sets";
import TestCreate from "./test-create";
import AICreate from "./ai-create";

interface Flashcard {
  id: number;
  question: string;
  answer: string;
  image: string | null;
  lastReviewed: number;
  reviewCount: number;
}

interface CardSet {
  id: number;
  title: string;
  description: string;
  cards: Flashcard[];
}

interface TestQuestion {
  id: number;
  question: string;
  answerType: "multiple" | "short";
  options?: string[];
  correctAnswer: string;
  image: string | null;
}

interface TestSet {
  id: number;
  name: string;
  description: string;
  questions: TestQuestion[];
}

// New combined type
type CombinedSet = CardSet | TestSet;

export default function CreateCards() {
  const [cardSets, setCardSets] = useState<CardSet[]>([]);
  const [testSets, setTestSets] = useState<TestSet[]>([]);
  const [combinedSets, setCombinedSets] = useState<CombinedSet[]>([]);
  const [currentPage, setCurrentPage] = useState("create");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    // Update the combinedSets whenever cardSets or testSets change
    setCombinedSets([...cardSets, ...testSets]);
  }, [cardSets, testSets]);

  const renderContent = () => {
    switch (currentPage) {
      case "create":
        return (
          <CreateCardSet
            setCardSets={setCardSets}
            setNotification={setNotification}
          />
        );
      case "edit":
        return (
          <EditCardSets
            combinedSets={combinedSets}
            setCardSets={setCardSets}
            setNotification={setNotification}
          />
        );
      case "test":
        return (
          <TestCreate setTestSets={setTestSets} setNotification={setNotification} />
        );
      case "ai":
        return <AICreate />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar removed as you mentioned you don't use it.
          The navigation is now handled with a simple header below. */}
      <div className="w-full p-8 overflow-auto">
        <header className="mb-8">
          <h1
            className="text-4xl font-bold text-center"
            style={{ color: "#0D005B" }}
          >
            {currentPage === "create"
              ? "Create Card Set"
              : currentPage === "edit"
              ? "Edit Card Sets"
              : currentPage === "test"
              ? "Test Create"
              : currentPage === "ai"
              ? "AI Create"
              : ""}
          </h1>
          {/* Optional simple navigation */}
          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={() => setCurrentPage("create")}
              className={`px-4 py-2 rounded ${
                currentPage === "create" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Create
            </button>
            <button
              onClick={() => setCurrentPage("edit")}
              className={`px-4 py-2 rounded ${
                currentPage === "edit" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setCurrentPage("test")}
              className={`px-4 py-2 rounded ${
                currentPage === "test" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Test
            </button>
            <button
              onClick={() => setCurrentPage("ai")}
              className={`px-4 py-2 rounded ${
                currentPage === "ai" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              AI
            </button>
          </div>
        </header>
        {notification && (
          <Alert
            variant={notification.type === "success" ? "default" : "destructive"}
            className="mb-4"
          >
            <AlertTitle>
              {notification.type === "success" ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        )}
        {renderContent()}
      </div>
    </div>
  );
}
