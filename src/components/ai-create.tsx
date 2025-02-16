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
      // API integration could be added here
      setTimeout(() => {
        setAiMessages(prev => [...prev, { role: 'ai', content: `You said: ${aiInput}` }])
      }, 1000)
      setAiInput('')
    }
  }

  return (
    <div className="ml-64 mt-16 p-8 w-[calc(100%-16rem)] flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-lg p-6 h-96 overflow-y-auto shadow-md">
          {aiMessages.map((message, index) => (
            <div key={index} className={`mb-6 transition-all ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-4 rounded-lg ${message.role === 'user' ? 'bg-cyan-100' : 'bg-gray-100'} text-xl`}>
                {message.content}
              </span>
            </div>
          ))}
        </div>
        <div className="flex space-x-6 mt-8">
          <Input
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow bg-white border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500 transition-all duration-200 text-xl py-4 px-4"
          />
          <Button onClick={sendAiMessage} className="bg-cyan-600 hover:bg-cyan-700 text-white text-2xl py-6 px-10 transition-colors duration-200">
            <SendIcon className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </div>
  )
}
