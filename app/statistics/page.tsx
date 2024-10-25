"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/shared/DashboardHeader"
import DashboardFooter from "@/components/shared/DashboardFooter"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Trophy, Award, Clock } from "lucide-react"
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

interface UserStats {
  id: string
  name: string
  points: number
  tasks_completed: number
}

interface TaskHistory {
  id: string
  title: string
  completed_by: string
  completed_at: string
}

interface ProfileData {
  id: string
  full_name: string | null
  email: string
  points: number
  tasks_completed: string | null
}

export default function Statistics() {
  const [stats, setStats] = useState<UserStats[]>([])
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!supabase) {
          throw new Error("Supabase client not initialized")
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          router.replace("/login")
          return
        }

        // Fetch task history
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select(`
            id,
            title,
            completed_at,
            profiles (
              full_name,
              email
            )
          `)
          .eq('completed', true)
          .order('completed_at', { ascending: false })
          .limit(20)

        if (tasksError) throw tasksError

        const formattedHistory = tasks?.map(task => ({
          id: task.id,
          title: task.title,
          completed_by: task.profiles?.full_name || task.profiles?.email || 'Unbekannt',
          completed_at: task.completed_at
        })) || []

        setTaskHistory(formattedHistory)

        // Fetch user statistics with a simpler query first
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email, points')

        if (profilesError) throw profilesError

        // Then fetch task counts separately
        const statsPromises = profilesData.map(async (profile) => {
          const { count } = await supabase
            .from('tasks')
            .select('*', { count: 'exact', head: true })
            .eq('assigned_to', profile.id)
            .eq('completed', true)

          return {
            id: profile.id,
            name: profile.full_name || profile.email.split('@')[0],
            points: profile.points || 0,
            tasks_completed: count || 0
          }
        })

        const statsData = await Promise.all(statsPromises)
        setStats(statsData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching statistics:", error)
        setLoading(false)
      }
    }

    fetchData()
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

      <main className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-[#4A3E4C] mb-6">Statistiken</h1>

          {/* Top Performers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#F0ECC9] p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="h-6 w-6 text-[#F2B05E]" />
                <h3 className="font-semibold text-[#4A3E4C]">Top Performer</h3>
              </div>
              <p className="text-2xl font-bold text-[#65C3BA]">{stats[0]?.name || 'Noch keine Daten'}</p>
              <p className="text-sm text-gray-600">{stats[0]?.points || 0} Punkte</p>
            </div>

            <div className="bg-[#F0ECC9] p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Award className="h-6 w-6 text-[#F2B05E]" />
                <h3 className="font-semibold text-[#4A3E4C]">Meiste Aufgaben</h3>
              </div>
              <p className="text-2xl font-bold text-[#65C3BA]">
                {stats.length > 0 ? stats.reduce((max, user) => 
                  user.tasks_completed > max.tasks_completed ? user : max
                ).name : 'Noch keine Daten'}
              </p>
              <p className="text-sm text-gray-600">
                {stats.length > 0 ? stats.reduce((max, user) => 
                  user.tasks_completed > max.tasks_completed ? user : max
                ).tasks_completed : 0} Aufgaben
              </p>
            </div>
          </div>

          {/* Points Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 mb-8">
            <h3 className="text-xl font-semibold text-[#4A3E4C] mb-6">Punkteverteilung</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="points" name="Punkte" fill="#65C3BA" />
                  <Bar dataKey="tasks_completed" name="Erledigte Aufgaben" fill="#F2B05E" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task History */}
          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="h-6 w-6 text-[#65C3BA]" />
              <h3 className="text-xl font-semibold text-[#4A3E4C]">Aufgabenverlauf</h3>
            </div>
            <div className="space-y-4">
              {taskHistory.length > 0 ? (
                taskHistory.map(task => (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium text-[#4A3E4C]">{task.title}</h4>
                      <p className="text-sm text-gray-500">Erledigt von {task.completed_by}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(task.completed_at), 'PPp', { locale: de })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Noch keine Aufgaben erledigt
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  )
}
