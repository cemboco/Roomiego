"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Task, UserProfile } from "@/types/dashboard"
import { Calendar, Clock, Plus, Trash2 } from "lucide-react"

interface TaskListProps {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  householdMembers: UserProfile[]
  currentUser: any
}

export default function TaskList({ tasks, setTasks, householdMembers, currentUser }: TaskListProps) {
  const [newTask, setNewTask] = useState("")
  const [selectedMember, setSelectedMember] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [quickActionMinutes, setQuickActionMinutes] = useState("")

  const handleAddTask = () => {
    if (!newTask || !selectedMember) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      assignedTo: selectedMember,
      createdBy: currentUser.id,
      dueDate: dueDate || null,
      quickActionMinutes: quickActionMinutes ? parseInt(quickActionMinutes) : null,
      completed: false,
      startTime: quickActionMinutes ? new Date().toISOString() : null,
    }

    setTasks([...tasks, task])
    setNewTask("")
    setSelectedMember("")
    setDueDate("")
    setQuickActionMinutes("")
  }

  const handleCompleteTask = (taskId: string) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId
          ? { ...task, completed: true }
          : task
      )
    )
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-primary mb-6">Aufgaben</h2>

      {/* Add Task Form */}
      <div className="space-y-4 mb-8">
        <Input
          placeholder="Neue Aufgabe"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Select value={selectedMember} onValueChange={setSelectedMember}>
          <SelectTrigger>
            <SelectValue placeholder="Mitglied auswählen" />
          </SelectTrigger>
          <SelectContent>
            {householdMembers.map(member => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
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
        <Button onClick={handleAddTask} className="w-full bg-secondary hover:bg-secondary/90">
          <Plus className="mr-2 h-4 w-4" />
          Aufgabe hinzufügen
        </Button>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`p-4 rounded-lg border ${
              task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-secondary'
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
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500 space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {task.dueDate || 'Kein Datum'}
              </div>
              {task.quickActionMinutes && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {task.quickActionMinutes} Minuten
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
