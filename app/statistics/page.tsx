"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/shared/DashboardHeader"
import DashboardFooter from "@/components/shared/DashboardFooter"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface CompletedTask {
  id: string
  title: string
  completed_at: string
  user_name: string
}

export default function Statistics() {
  const [taskHistory, setTaskHistory] = useState<CompletedTask[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.replace("/login")
          return
        }

        // Hole die household_id des aktuellen Benutzers
        const { data: userHousehold } = await supabase
          .from('user_households')
          .select('household_id')
          .eq('user_id', session.user.id)
          .single()

        if (!userHousehold) return

        // Hole alle erledigten Aufgaben mit Benutzernamen
        const { data: completedTasks, error } = await supabase
          .from('tasks')
          .select(`
            id,
            title,
            completed_at,
            assigned_to (
              id,
              full_name,
              email
            )
          `)
          .eq('household_id', userHousehold.household_id)
          .eq('completed', true)
          .order('completed_at', { ascending: false })

        if (error) throw error

        const formattedTasks = completedTasks.map(task => ({
          id: task.id,
          title: task.title,
          completed_at: task.completed_at,
          user_name: task.assigned_to?.full_name || task.assigned_to?.email.split('@')[0] || 'Unbekannt'
        }))

        setTaskHistory(formattedTasks)
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

          {/* Task History */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-[#4A3E4C] mb-4">Aufgabenverlauf</h2>
            <div className="space-y-4">
              {taskHistory.map(task => (
                <div 
                  key={task.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-[#4A3E4C]">{task.title}</h3>
                      <p className="text-sm text-gray-500">Erledigt von: {task.user_name}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(task.completed_at).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  )
}
