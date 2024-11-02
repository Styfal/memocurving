"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Users', total: 250, active: 180 },
  { name: 'Card Sets', total: 500, active: 350 },
  { name: 'Test Sets', total: 200, active: 120 },
];

export default function Analytics() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded">
          <h2 className="text-xl font-bold">Total Users</h2>
          <p className="text-3xl">250</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h2 className="text-xl font-bold">Total Card Sets</h2>
          <p className="text-3xl">500</p>
        </div>
        <div className="bg-purple-100 p-4 rounded">
          <h2 className="text-xl font-bold">Total Test Sets</h2>
          <p className="text-3xl">200</p>
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" />
            <Bar dataKey="active" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}