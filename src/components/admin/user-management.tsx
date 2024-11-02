"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: Date;
}

interface UserManagementProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setNotification: React.Dispatch<React.SetStateAction<{ type: 'success' | 'error'; message: string } | null>>;
}

export default function UserManagement({ 
  users, 
  setUsers, 
  setNotification 
}: UserManagementProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleDeleteUser = (userId: number) => {
    try {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      setNotification({
        type: 'success',
        message: 'User deleted successfully'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to delete user'
      });
    }
  };

  const handleChangeRole = (userId: number, newRole: 'admin' | 'user' | 'moderator') => {
    try {
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);
      setNotification({
        type: 'success',
        message: 'User role updated successfully'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to update user role'
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select 
                  value={user.role}
                  onChange={(e) => handleChangeRole(user.id, e.target.value as 'admin' | 'user' | 'moderator')}
                  className="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.createdAt.toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Button 
                  variant="destructive" 
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}