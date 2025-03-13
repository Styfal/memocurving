

"use client";

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Sidebar from "./sidebar";
import UserManagement from "./user-management";
import ContentManagement from "./content-management";
import Analytics from "./analytics";
import Settings from "./settings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user" | "moderator";
  createdAt: Date;
}

// Create a typed alias for UserManagement so TS recognizes its props.
const UserManagementComponent = UserManagement as React.FC<{
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setNotification: React.Dispatch<
    React.SetStateAction<{ type: "success" | "error"; message: string } | null>
  >;
}>;

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState("users");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null); // null: loading, true: allowed, false: not allowed

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user document from Firestore using the user's UID
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const email = userData.email;
          // Get allowed emails from the environment variable
          const allowedEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS
            ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",")
            : [];
          // Check if the email is in the list of allowed emails
          if (allowedEmails.includes(email)) {
            setAllowed(true);
          } else {
            setAllowed(false);
          }
        } else {
          setAllowed(false);
        }
      } else {
        setAllowed(false);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  // Handle notifications disappearing after a short time
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // If still loading the permission check, show a loader
  if (allowed === null) return <div>Loading...</div>;
  // If not allowed, show an error message or handle redirection
  if (!allowed)
    return <div>You do not have permission to access this page.</div>;

  const renderContent = () => {
    switch (currentPage) {
      case "users":
        return (
          <UserManagementComponent
            users={users}
            setUsers={setUsers}
            setNotification={setNotification}
          />
        );
      case "content":
        return <ContentManagement setNotification={setNotification} />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <Settings setNotification={setNotification} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar for navigation */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        menuItems={[
          { key: "users", label: "User Management" },
          { key: "content", label: "Content Management" },
          { key: "analytics", label: "Analytics" },
          { key: "settings", label: "Settings" },
        ]}
      />

      {/* Main content area */}
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-cyan-800">
          {currentPage === "users"
            ? "User Management"
            : currentPage === "content"
            ? "Content Management"
            : currentPage === "analytics"
            ? "Analytics"
            : currentPage === "settings"
            ? "Settings"
            : ""}
        </h1>

        {/* Notification Alert */}
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

        {/* Dynamic Content Rendering */}
        {renderContent()}
      </div>
    </div>
  );
}
