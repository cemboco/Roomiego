"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bell, Settings, User } from "lucide-react"
import Link from "next/link"
import TaskList from "@/components/dashboard/TaskList"
import Chat from "@/components/dashboard/Chat"
import { Task, UserProfile } from "@/types"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [householdName, setHouseholdName] = useState("")
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [householdMembers, setHouseholdMembers] = useState<UserProfile[]>([])
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/login")
          return
        }
        setUser(user)
        setHouseholdName(user?.user_metadata?.household_name || "")
        // Fetch household members and tasks here
        setLoading(false)
      } catch (error) {
        console.error("Error fetching user:", error)
        setLoading(false)
      }
    }
    getUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F0ECC9]">
      {/* Header */}
      <header className="bg-white shadow-md p-4 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-3xl font-bold text-[#4A3E4C]">Roomie</div>
          <div className="flex items-center gap-4">
            <button className="relative">
              <Bell className="h-6 w-6 text-[#4A3E4C] hover:text-[#65C3BA] transition-colors" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
            <Link href="/profile">
              <Button variant="ghost" className="p-2">
                <User className="h-6 w-6 text-[#4A3E4C] hover:text-[#65C3BA]" />
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" className="p-2">
                <Settings className="h-6 w-6 text-[#4A3E4C] hover:text-[#65C3BA]" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-20 px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">
          {householdName}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tasks Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <TaskList 
              tasks={tasks} 
              setTasks={setTasks} 
              householdMembers={householdMembers}
              currentUser={user}
            />
          </div>

          {/* Chat Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Chat householdMembers={householdMembers} currentUser={user} />
          </div>
        </div>
      </main>
    </div>
  )
}
