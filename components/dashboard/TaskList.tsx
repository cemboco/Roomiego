"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Task, UserProfile } from "@/app/types"
import { Plus, Trash2, Calendar, Clock } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface TaskListProps {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  householdMembers: UserProfile[]
  currentUser: any
}

export default function TaskList({ tasks, setTasks, householdMembers, currentUser }: TaskListProps) {
  const [newTask, setNewTask] = useState("")
  const [selectedMember, setSelectedMember] = useState<string>("")
  const [dueDate, setDueDate] = useState("")
  const [quickActionMinutes, setQuickActionMinutes] = useState("")

  useEffect(() => {
    if (currentUser?.id && !selectedMember) {
      setSelectedMember(currentUser.id)
    }
  }, [currentUser, selectedMember])

  const handleAddTask = async () => {
    if (!newTask) return

    try {
      const task = {
        title: newTask,
        assigned_to: selectedMember || currentUser.id,
        created_by: currentUser.id,
        household_id: currentUser.user_metadata.household_id,
        due_date: dueDate || null,
        quick_action_minutes: quickActionMinutes ? parseInt(quickActionMinutes) : null,
        completed: false,
        start_time: null,
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single()

      if (error) throw error

      setTasks([...tasks, data])
      setNewTask("")
      setSelectedMember(currentUser.id)
      setDueDate("")
      setQuickActionMinutes("")

      // Punkte für das Erstellen einer Aufgabe
      await supabase.rpc('increment_user_points', {
        user_id: currentUser.id,
        points_to_add: 5
      })
    } catch (error) {
      console.error("Error adding task:", error)
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId)

      if (error) throw error

      setTasks(
        tasks.map(task =>
          task.id === taskId
            ? { ...task, completed: true }
            : task
        )
      )

      // Punkte für das Abschließen einer Aufgabe
      await supabase.rpc('increment_user_points', {
        user_id: currentUser.id,
        points_to_add: 10
      })
    } catch (error) {
      console.error("Error completing task:", error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error

      setTasks(tasks.filter(task => task.id !== taskId))
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#4A3E4C] mb-6">Aufgaben</h2>

      <div className="space-y-4 mb-8">
        <Input
          placeholder="Neue Aufgabe"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="w-full"
        />
        
        <Select 
          value={selectedMember || currentUser?.id} 
          onValueChange={setSelectedMember}
        >
          <SelectTrigger>
            <SelectValue placeholder="Mitglied auswählen" />
          </SelectTrigger>
          <SelectContent>
            {householdMembers.map(member => (
              <SelectItem 
                key={member.id} 
                value={member.id}
              >
                {member.full_name || member.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-4">
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="flex-1"
          />
          <Input
            type="number"
            placeholder="Quick Action (Minuten)"
            value={quickActionMinutes}
            onChange={(e) => setQuickActionMinutes(e.target.value)}
            min="1"
            className="flex-1"
          />
        </div>
        
        <Button 
          onClick={handleAddTask} 
          className="w-full bg-[#65C3BA] hover:bg-[#4A3E4C] transition-all duration-300"
        >
          <Plus className="mr-2 h-4 w-4" />
          Aufgabe hinzufügen
        </Button>
      </div>

      <div className="space-y-4">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`p-4 rounded-xl border ${
              task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-[#65C3BA]'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
              <div className="flex gap-2">
                {!task.completed && (
                  <Button
                    onClick={() => handleCompleteTask(task.id)}
                    variant="outline"
                    size="sm"
                    className="text-green-600 hover:text-green-700"
                  >
                    Erledigt
                  </Button>
                )}
                {task.completed && (
                  <Button
                    onClick={() => handleDeleteTask(task.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500 space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {task.due_date ? new Date(task.due_date).toLocaleDateString('de-DE') : 'Kein Datum'}
              </div>
              {task.quick_action_minutes && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {task.quick_action_minutes} Minuten
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
