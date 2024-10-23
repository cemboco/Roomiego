"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserProfile } from "@/app/types"
import { Send } from "lucide-react"

interface ChatProps {
  householdMembers: UserProfile[]
  currentUser: any
}

export default function Chat({ householdMembers, currentUser }: ChatProps) {
  const [message, setMessage] = useState("")

  const handleSendMessage = () => {
    // This will be implemented later
    setMessage("")
  }

  return (
    <div className="h-[600px] flex flex-col">
      <h2 className="text-2xl font-semibold text-primary mb-6">Chat</h2>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center text-gray-500">
          Chat-Funktion wird bald verfügbar sein
        </div>
      </div>

      {/* Message Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Nachricht eingeben..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={handleSendMessage}
          className="bg-secondary hover:bg-secondary/90"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
