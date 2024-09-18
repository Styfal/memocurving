'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SendIcon } from 'lucide-react'

export default function AiCreate() {
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([])
  const [aiInput, setAiInput] = useState('')

  const sendAiMessage = () => {
    if (aiInput.trim()) {
      setAiMessages([...aiMessages, { role: 'user', content: aiInput }])
      // If Shuko or Shotaro can add the API for AIs. I also have TRPC setup up so you can link APIs on there 
      // using index.js 
      // Allow ability to create flashcards and tests on its own 
    
      setTimeout(() => {
        setAiMessages(prev => [...prev, { role: 'ai', content: `You said: ${aiInput}` }])
      }, 1000)
      setAiInput('')
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/50 rounded-lg p-4 h-96 overflow-y-auto">
        {aiMessages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-cyan-100' : 'bg-gray-100'}`}>
              {message.content}
            </span>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Input
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
        />
        <Button onClick={sendAiMessage} className="bg-cyan-600 hover:bg-cyan-700 text-white">
          <SendIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}