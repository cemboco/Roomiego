"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bell, Settings, User } from "lucide-react"
import Link from "next/link"
import TaskList from "@/components/dashboard/TaskList"
import Chat from "@/components/dashboard/Chat"
import { Task, UserProfile } from "@/app/types"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [householdName, setHouseholdName] = useState("")
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [householdMembers, setHouseholdMembers] = useState<UserProfile[]>([])
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!supabase) {
          throw new Error("Supabase client not initialized")
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          throw sessionError
        }

        if (!session) {
          router.replace("/login")
          return
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          throw userError
        }

        if (!user) {
          router.replace("/login")
          return
        }

        setUser(user)
        setHouseholdName(user?.user_metadata?.household_name || "Mein Haushalt")
        
        // Fetch household members
        const { data: members, error: membersError } = await supabase
          .from('household_members')
          .select('*')
          .eq('household_id', user.user_metadata.household_id)

        if (membersError) {
          console.error("Error fetching household members:", membersError)
        } else {
          setHouseholdMembers(members || [])
        }

        // Fetch tasks
        const { data: taskData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('household_id', user.user_metadata.household_id)
          .order('created_at', { ascending: false })

        if (tasksError) {
          console.error("Error fetching tasks:", tasksError)
        } else {
          setTasks(taskData || [])
        }

        setLoading(false)
      } catch (error) {
        console.error("Authentication error:", error)
        router.replace("/login")
      }
    }

    checkAuth()

    // Set up real-time subscription for tasks
    const tasksSubscription = supabase
      ?.channel('tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, payload => {
        if (payload.eventType === 'INSERT') {
          setTasks(current => [...current, payload.new as Task])
        } else if (payload.eventType === 'UPDATE') {
          setTasks(current => current.map(task => 
            task.id === payload.new.id ? payload.new as Task : task
          ))
        } else if (payload.eventType === 'DELETE') {
          setTasks(current => current.filter(task => task.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      tasksSubscription?.unsubscribe()
    }
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
