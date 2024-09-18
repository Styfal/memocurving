import React from 'react';
import { AlarmClockCheck, BookOpen, Trophy } from "lucide-react";

export const Showcase = () => {
  return (
    <div className="flex flex-wrap justify-center gap-x-12">
      {/* Card 1 */}
      <div className="flex justify-center items-center bg-gradient-to-r from-cyan-300 to-blue-400 p-5 rounded-xl w-[300px] max-w-full shadow-lg ransform transition-transform duration-300 hover:scale-105">
        <div className="justify-center items-center font-bold text-[80px] inline-flex tracking-tight text-white flex-col text-center">
          <span className="pb-3 pt-1">
            <AlarmClockCheck size={60} />
          </span>
          <span>80%</span>
          <p className="text-[30px] font-medium tracking-tight text-white py-3 text-center">
            Increased productivity in memorization of academic content
          </p>
        </div>
      </div>

      {/* Card 2 */}
      <div className="flex justify-center items-center bg-gradient-to-r from-green-300 to-emerald-400 p-5 rounded-xl w-[300px] max-w-full shadow-lg transform transition-transform duration-300 hover:scale-105">
        <div className="justify-center items-center font-bold text-[80px] inline-flex tracking-tight text-white flex-col text-center">
          <span className="pb-3 pt-1">
            <BookOpen size={60} />
          </span>
          <span>95%</span>
          <p className="text-[30px] font-medium tracking-tight text-white py-3 text-center">
            Enhanced comprehension and retention of complex subjects
          </p>
        </div>
      </div>

      {/* Card 3 */}
      <div className="flex justify-center items-center bg-gradient-to-r from-purple-300 to-indigo-400 p-5 rounded-xl w-[300px] max-w-full shadow-lg transform transition-transform duration-300 hover:scale-105">
        <div className="justify-center items-center font-bold text-[80px] inline-flex tracking-tight text-white flex-col text-center">
          <span className="pb-3 pt-1">
            <Trophy size={60} />
          </span>
          <span>70%</span>
          <p className="text-[30px] font-medium tracking-tight text-white py-3 text-center">
            Improvement in overall academic performance and grades
          </p>
        </div>
      </div>
    </div>
  );
};