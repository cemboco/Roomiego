"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import TaskList from "@/components/dashboard/TaskList"
import Chat from "@/components/dashboard/Chat"
import { Task, UserProfile } from "@/app/types"
import DashboardHeader from "@/components/shared/DashboardHeader"
import DashboardFooter from "@/components/shared/DashboardFooter"

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
      <div className="min-h-screen bg-gradient-to-b from-[#F0ECC9] to-white flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0ECC9] to-white">
      <DashboardHeader />

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
        {/* Welcome Message */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
          <h1 className="text-3xl font-bold text-[#4A3E4C] mb-4">
            Willkommen zurück, {user?.user_metadata?.full_name || 'Mitbewohner'}!
          </h1>
          <p className="text-gray-600 text-lg">
            Schön, dass du da bist. Hier ist der aktuelle Stand in {householdName}:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-[#F0ECC9] p-6 rounded-xl">
              <h3 className="font-semibold text-[#4A3E4C] mb-2">Offene Aufgaben</h3>
              <p className="text-2xl font-bold text-[#65C3BA]">
                {tasks.filter(task => !task.completed).length}
              </p>
            </div>
            <div className="bg-[#F0ECC9] p-6 rounded-xl">
              <h3 className="font-semibold text-[#4A3E4C] mb-2">Deine Punkte</h3>
              <p className="text-2xl font-bold text-[#65C3BA]">
                {user?.user_metadata?.points || 0}
              </p>
            </div>
            <div className="bg-[#F0ECC9] p-6 rounded-xl">
              <h3 className="font-semibold text-[#4A3E4C] mb-2">Mitbewohner aktiv</h3>
              <p className="text-2xl font-bold text-[#65C3BA]">
                {householdMembers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tasks Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
            <TaskList 
              tasks={tasks} 
              setTasks={setTasks} 
              householdMembers={householdMembers}
              currentUser={user}
            />
          </div>

          {/* Chat Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
            <Chat householdMembers={householdMembers} currentUser={user} />
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  )
}
