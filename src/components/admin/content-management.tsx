"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ContentManagementProps {
  setNotification: React.Dispatch<React.SetStateAction<{ type: 'success' | 'error'; message: string } | null>>;
}

export default function ContentManagement({ 
  setNotification 
}: ContentManagementProps) {
  const [contentType, setContentType] = useState<'cards' | 'tests'>('cards');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    try {
      // Simulated search logic
      setNotification({
        type: 'success',
        message: `Searched for ${contentType} with term: ${searchTerm}`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Search failed'
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <select 
          value={contentType}
          onChange={(e) => setContentType(e.target.value as 'cards' | 'tests')}
          className="p-2 border rounded"
        >
          <option value="cards">Card Sets</option>
          <option value="tests">Test Sets</option>
        </select>
        <Input 
          placeholder={`Search ${contentType}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <div>
        {/* Placeholder for content list */}
        <p>Content management for {contentType}</p>
      </div>
    </div>
  );
}