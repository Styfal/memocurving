"use client";

import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Sidebar from './sidebar'; 
import UserManagement from './user-management'; 
import ContentManagement from './content-management'; 
import Analytics from './analytics'; 
import Settings from './settings'; 

// Define interfaces for your data models
interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: Date;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState('users');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const renderContent = () => {
    switch (currentPage) {
      case 'users':
        return (
          <UserManagement 
            users={users} 
            setUsers={setUsers} 
            setNotification={setNotification} 
          />
        );
      case 'content':
        return (
          <ContentManagement 
            setNotification={setNotification} 
          />
        );
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return (
          <Settings 
            setNotification={setNotification} 
          />
        );
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
          { key: 'users', label: 'User Management' },
          { key: 'content', label: 'Content Management' },
          { key: 'analytics', label: 'Analytics' },
          { key: 'settings', label: 'Settings' }
        ]}
      />

      {/* Main content area */}
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-cyan-800">
          {currentPage === 'users' ? 'User Management' :
           currentPage === 'content' ? 'Content Management' :
           currentPage === 'analytics' ? 'Analytics' :
           currentPage === 'settings' ? 'Settings' : ''}
        </h1>

        {/* Notification Alert */}
        {notification && (
          <Alert 
            variant={notification.type === 'success' ? 'default' : 'destructive'} 
            className="mb-4"
          >
            <AlertTitle>{notification.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        )}

        {/* Dynamic Content Rendering */}
        {renderContent()}
      </div>
    </div>
  );
}