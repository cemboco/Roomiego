"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/shared/DashboardHeader"
import DashboardFooter from "@/components/shared/DashboardFooter"
import TaskList from "@/components/dashboard/TaskList"
import Chat from "@/components/dashboard/Chat"
import { Task, UserProfile } from "@/app/types"
import { Loader2 } from "lucide-react"

interface Household {
  id: string
  name: string
  type: 'wg' | 'family' | 'couple'
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [householdName, setHouseholdName] = useState("")
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [householdMembers, setHouseholdMembers] = useState<UserProfile[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!supabase) {
          throw new Error("Supabase client not initialized")
        }

        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          router.replace("/login")
          return
        }

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          router.replace("/login")
          return
        }

        setUser(user)

        // Get user's profile and household in a single query
        const { data: userHousehold, error: householdError } = await supabase
          .from('user_households')
          .select(`
            households (
              id,
              name,
              type
            )
          `)
          .eq('user_id', user.id)
          .single()

        if (householdError) {
          console.error("Error fetching household:", householdError)
          return
        }

        if (userHousehold?.households) {
          const household = userHousehold.households as Household
          setHouseholdName(household.name)

          // Fetch household members
          const { data: members, error: membersError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', (
              await supabase
                .from('user_households')
                .select('user_id')
                .eq('household_id', household.id)
            ).data?.map(uh => uh.user_id) || [])

          if (membersError) {
            console.error("Error fetching household members:", membersError)
          } else {
            setHouseholdMembers(members || [])
          }

          // Fetch tasks
          const { data: taskData, error: tasksError } = await supabase
            .from('tasks')
            .select('*')
            .eq('household_id', household.id)
            .order('created_at', { ascending: false })

          if (tasksError) {
            console.error("Error fetching tasks:", tasksError)
          } else {
            setTasks(taskData || [])
          }
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()

    // Set up real-time subscriptions
    const tasksSubscription = supabase
      ?.channel('tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, payload => {
        if (payload.eventType === 'INSERT') {
          setTasks(current => [payload.new as Task, ...current])
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
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#65C3BA]" />
          <span className="text-xl text-[#4A3E4C]">Laden...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0ECC9] to-white">
      <DashboardHeader />

      <main className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
        {/* Welcome Message */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
          <h1 className="text-3xl font-bold text-[#4A3E4C] mb-2">
            Willkommen in {householdName}
          </h1>
          <p className="text-gray-600">
            Hier kannst du alle Aufgaben und Aktivitäten deines Haushalts verwalten.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            <Chat 
              householdMembers={householdMembers} 
              currentUser={user}
            />
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  )
}
