'use client';

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define types for review data
interface Review {
  day: number;
  count: number;
}

// EbbinghausCurve Component
const EbbinghausCurve: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentDay, setCurrentDay] = useState<number>(0);

  // Calculate memory retention based on Ebbinghaus formula
  const calculateRetention = (x: number, t: number, d: number): number => {
    return 100 * Math.pow(0.8, (x - d) / (1 + t));
  };

  // Generate data points for the chart
  const generateChartData = () => {
    const data = [];
    for (let i = 0; i <= currentDay; i++) {
      // Find the most recent review before this day
      const relevantReview = [...reviews]
        .reverse()
        .find((review) => review.day <= i);

      const t = relevantReview ? relevantReview.count : 0;
      const d = relevantReview ? relevantReview.day : 0;

      data.push({
        day: i,
        retention: parseFloat(calculateRetention(i, t, d).toFixed(1)),
      });
    }
    return data;
  };

  // Handle review action
  const handleReview = () => {
    const existingReview = reviews.find((r) => r.day === currentDay);
    if (existingReview) {
      setReviews(
        reviews.map((r) =>
          r.day === currentDay ? { ...r, count: r.count + 1 } : r
        )
      );
    } else {
      setReviews([...reviews, { day: currentDay, count: 1 }]);
    }
  };

  // Advance to the next day
  const nextDay = () => {
    setCurrentDay((prev) => prev + 1);
  };

  const chartData = generateChartData();
  const currentRetention =
    chartData.find((d) => d.day === currentDay)?.retention || 0;
  const needsReview = currentRetention <= 80;

  return (
    <div className="w-full max-w-4xl p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Ebbinghaus Forgetting Curve Simulator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Day {currentDay}</h3>
              <p className="text-sm text-gray-600">
                Current Retention: {currentRetention.toFixed(1)}%
              </p>
            </div>
            <div className="space-x-2">
              <Button onClick={handleReview} variant="default">
                Review Material
              </Button>
              <Button onClick={nextDay} variant="outline">
                Next Day
              </Button>
            </div>
          </div>

          {needsReview && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your retention has dropped to {currentRetention.toFixed(1)}%.
                Time to review!
              </AlertDescription>
            </Alert>
          )}

          <div className="w-full h-[400px] flex justify-center">
            <LineChart
              width={800}
              height={400}
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                label={{ value: 'Days', position: 'bottom' }}
                domain={[0, 'dataMax']}
                type="number"
                allowDecimals={false}
              />
              <YAxis
                domain={[0, 100]}
                label={{
                  value: 'Retention (%)',
                  angle: -90,
                  position: 'left',
                }}
              />
              <Tooltip />
              <ReferenceLine y={80} stroke="red" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="retention"
                stroke="#8884d8"
                dot={true}
                isAnimationActive={false}
              />
            </LineChart>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Review History</h4>
            <div className="space-y-1">
              {reviews.map((review, index) => (
                <p key={index} className="text-sm">
                  Day {review.day}: Reviewed {review.count} time(s)
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EbbinghausCurve;
