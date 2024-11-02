"use client";

import { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  menuItems: { key: string; label: string }[];
}

export default function Sidebar({ 
  currentPage, 
  setCurrentPage, 
  menuItems 
}: SidebarProps) {
  return (
    <div className="w-64 bg-gray-100 p-4">
      <nav>
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setCurrentPage(item.key)}
            className={`w-full text-left p-2 mb-2 rounded ${
              currentPage === item.key 
                ? 'bg-cyan-600 text-white' 
                : 'hover:bg-gray-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}