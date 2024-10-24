"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/shared/DashboardHeader"
import DashboardFooter from "@/components/shared/DashboardFooter"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Trophy, Award, Target } from "lucide-react"

interface UserStats {
  id: string
  name: string
  points: number
  tasks_completed: number
}

export default function Statistics() {
  const [stats, setStats] = useState<UserStats[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!supabase) {
          throw new Error("Supabase client not initialized")
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          router.replace("/login")
          return
        }

        // In a real app, this would be a proper database query
        // This is just example data
        const mockStats = [
          { id: '1', name: 'Anna', points: 150, tasks_completed: 15 },
          { id: '2', name: 'Max', points: 120, tasks_completed: 12 },
          { id: '3', name: 'Lisa', points: 90, tasks_completed: 9 },
          { id: '4', name: 'Tom', points: 80, tasks_completed: 8 },
        ]

        setStats(mockStats)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching statistics:", error)
        setLoading(false)
      }
    }

    fetchStats()
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#F0ECC9] p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="h-6 w-6 text-[#F2B05E]" />
                <h3 className="font-semibold text-[#4A3E4C]">Top Performer</h3>
              </div>
              <p className="text-2xl font-bold text-[#65C3BA]">{stats[0]?.name}</p>
              <p className="text-sm text-gray-600">{stats[0]?.points} Punkte</p>
            </div>

            <div className="bg-[#F0ECC9] p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Award className="h-6 w-6 text-[#F2B05E]" />
                <h3 className="font-semibold text-[#4A3E4C]">Meiste Aufgaben</h3>
              </div>
              <p className="text-2xl font-bold text-[#65C3BA]">
                {stats.reduce((max, user) => 
                  user.tasks_completed > max.tasks_completed ? user : max
                ).name}
              </p>
              <p className="text-sm text-gray-600">
                {stats.reduce((max, user) => 
                  user.tasks_completed > max.tasks_completed ? user : max
                ).tasks_completed} Aufgaben
              </p>
            </div>

            <div className="bg-[#F0ECC9] p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-6 w-6 text-[#F2B05E]" />
                <h3 className="font-semibold text-[#4A3E4C]">Wochenziel</h3>
              </div>
              <p className="text-2xl font-bold text-[#65C3BA]">75%</p>
              <p className="text-sm text-gray-600">15 von 20 Aufgaben</p>
            </div>
          </div>

          {/* Points Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-100">
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
        </div>
      </main>

      <DashboardFooter />
    </div>
  )
}
