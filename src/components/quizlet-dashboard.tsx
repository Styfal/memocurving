'use client'

import React, { useState, ChangeEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { BookOpen, Users, Brain, PlusCircle, Upload } from 'lucide-react'


// Shuko or Shotaro if you can help me change some stuff with the profile and add backend+db stuff that will amazing
// 1. Saves profile edits
// 2. Add friends but the frontend should cap the amount of friends visible so it doesnt overflow the container (probably a frontend thing)
// 3. Capping the word count for names, bio, and censoring profanities, etc. 


interface Friend {
  id: string;
  name: string;
  avatar: string;
}

export function QuizletDashboard() {
  const [friendId, setFriendId] = useState('')
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: 'Alice', avatar: '/placeholder.svg?height=40&width=40' },
    { id: '2', name: 'Bob', avatar: '/placeholder.svg?height=40&width=40' },
  ])
  const [userName, setUserName] = useState('User Name')
  const [userBio, setUserBio] = useState('Studying since 2023')
  const [userAvatar, setUserAvatar] = useState('/placeholder.svg?height=80&width=80')

  const addFriend = () => {
    if (friendId) {
      setFriends([...friends, { id: friendId, name: `Friend ${friendId}`, avatar: '/placeholder.svg?height=40&width=40' }])
      setFriendId('')
    }
  }

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result
        if (typeof result === 'string') {
          setUserAvatar(result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">Quizlet Dashboard</h1>
        
        {/* Flashcard Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2" />
              Flashcard Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Biology</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <Progress value={75} className="w-full" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Mathematics</span>
                  <span className="text-sm font-medium">60%</span>
                </div>
                <Progress value={60} className="w-full" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">History</span>
                  <span className="text-sm font-medium">90%</span>
                </div>
                <Progress value={90} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio and Friends Container */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Portfolio Section */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4">Your Portfolio</h2>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={userAvatar} alt="User avatar" />
                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{userName}</h3>
                    <p className="text-gray-500">{userBio}</p>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Edit Profile</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={userName}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bio" className="text-right">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          value={userBio}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setUserBio(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="picture" className="text-right">
                          Picture
                        </Label>
                        <div className="col-span-3">
                          <Label htmlFor="picture" className="cursor-pointer">
                            <div className="flex items-center space-x-2 border rounded p-2">
                              <Upload className="h-4 w-4" />
                              <span>Upload new picture</span>
                            </div>
                          </Label>
                          <Input
                            id="picture"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogTrigger asChild>
                      <Button type="submit">Save changes</Button>
                    </DialogTrigger>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Friends Section */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Users className="mr-2" />
                  Friends
                </h2>
                <div className="flex flex-wrap gap-4 mb-4">
                  {friends.map((friend) => (
                    <div key={friend.id} className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback>{friend.name[0]}</AvatarFallback>
                      </Avatar>
                      <span>{friend.name}</span>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter friend ID"
                    value={friendId}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFriendId(e.target.value)}
                  />
                  <Button onClick={addFriend}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Friend
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2" />
              AI Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">Based on your recent activity, we recommend focusing on:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Mathematics: Algebra concepts</li>
              <li>Biology: Cell structure and function</li>
              <li>History: World War II timeline</li>
            </ul>
            <Button className="mt-4">Start Recommended Session</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}