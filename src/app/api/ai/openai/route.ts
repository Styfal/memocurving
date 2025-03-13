

import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Helper function to get a month key from a date (e.g. "2025-2")
function getCurrentMonthKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

// Checks and increments the AI usage count for a given user.
async function checkAndIncrementAIUsage(userId: string): Promise<{ allowed: boolean; error?: string }> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    return { allowed: false, error: 'User not found' };
  }
  const userData = userSnap.data();
  const isPremium = userData?.isPremium || false;
  let usageCount = userData?.aiUsageCount || 0;
  let usageResetAt = userData?.aiUsageResetAt ? new Date(userData.aiUsageResetAt) : new Date(0);
  const now = new Date();

  // Reset the counter if we're in a new month.
  if (getCurrentMonthKey(now) !== getCurrentMonthKey(usageResetAt)) {
    usageCount = 0;
    usageResetAt = now;
    await updateDoc(userRef, { aiUsageCount: 0, aiUsageResetAt: now.toISOString() });
  }
  const limit = isPremium ? 50 : 5;
  if (usageCount >= limit) {
    return { allowed: false, error: 'AI usage limit reached for this month.' };
  }
  // Increment the usage count.
  await updateDoc(userRef, { aiUsageCount: usageCount + 1 });
  return { allowed: true };
}

export async function POST(request: Request) {
  const { prompt, userId } = await request.json(); // Expect userId in the request body

  // Check if the user is allowed to use the AI API.
  const usageResult = await checkAndIncrementAIUsage(userId);
  if (!usageResult.allowed) {
    return NextResponse.json({ error: usageResult.error }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
      }),
    });

    const data = await response.json();
    console.log("OpenAI API Response:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return NextResponse.json({ error: "Error calling OpenAI API" }, { status: 500 });
  }
}
