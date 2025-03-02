"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ContentManagementProps {
  setNotification: React.Dispatch<React.SetStateAction<{ type: 'success' | 'error'; message: string } | null>>;
}

export default function ContentManagement({ 
  setNotification 
}: ContentManagementProps) {
  // Updated state type and default value to match Firestore collection 'cardSets'
  const [contentType, setContentType] = useState<'cardSets' | 'tests'>('cardSets');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    try {
      // Reference the correct Firestore collection based on contentType
      const collectionRef = collection(db, contentType);
      
      // Build a query based on a field. Adjust the field name (e.g., 'title') to match your data.
      const q = query(collectionRef, where("title", "==", searchTerm));

      const querySnapshot = await getDocs(q);
      let resultsCount = querySnapshot.size;

      // Example: Notify the user about the number of results found
      setNotification({
        type: 'success',
        message: `Found ${resultsCount} ${contentType} for "${searchTerm}".`
      });
      
      // Process the results if needed
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });
      
    } catch (error) {
      console.error("Error searching:", error);
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
          onChange={(e) => setContentType(e.target.value as 'cardSets' | 'tests')}
          className="p-2 border rounded"
        >
          <option value="cardSets">Card Sets</option>
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
