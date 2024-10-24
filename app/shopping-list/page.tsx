"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import DashboardHeader from "@/components/shared/DashboardHeader"
import DashboardFooter from "@/components/shared/DashboardFooter"
import { Plus, Trash2 } from "lucide-react"

interface ShoppingItem {
  id: string
  name: string
  completed: boolean
  created_by: string
  household_id: string
}

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [newItem, setNewItem] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (!supabase) {
          throw new Error("Supabase client not initialized")
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          router.replace("/login")
          return
        }

        const { data: items, error } = await supabase
          .from('shopping_items')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        setItems(items || [])
        setLoading(false)
      } catch (error) {
        console.error("Error fetching shopping items:", error)
        setLoading(false)
      }
    }

    fetchItems()

    const subscription = supabase
      ?.channel('shopping_items')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shopping_items' }, payload => {
        if (payload.eventType === 'INSERT') {
          setItems(current => [payload.new as ShoppingItem, ...current])
        } else if (payload.eventType === 'UPDATE') {
          setItems(current => current.map(item => 
            item.id === payload.new.id ? payload.new as ShoppingItem : item
          ))
        } else if (payload.eventType === 'DELETE') {
          setItems(current => current.filter(item => item.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      subscription?.unsubscribe()
    }
  }, [router])

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItem.trim()) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { error } = await supabase
        .from('shopping_items')
        .insert([
          {
            name: newItem.trim(),
            completed: false,
            created_by: user?.id,
            household_id: user?.user_metadata?.household_id
          }
        ])

      if (error) throw error
      
      setNewItem("")
    } catch (error) {
      console.error("Error adding item:", error)
    }
  }

  const toggleItem = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('shopping_items')
        .update({ completed })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error("Error updating item:", error)
    }
  }

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('shopping_items')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

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
          <h1 className="text-3xl font-bold text-[#4A3E4C] mb-6">Einkaufsliste</h1>
          
          <form onSubmit={handleAddItem} className="flex gap-4 mb-8">
            <Input
              type="text"
              placeholder="Neuen Artikel hinzufügen"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="flex-1"
            />
            <Button 
              type="submit"
              className="bg-[#65C3BA] hover:bg-[#4A3E4C] transition-all duration-300"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </form>

          <div className="space-y-4">
            {items.map(item => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  item.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-[#65C3BA]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={(checked) => toggleItem(item.id, checked as boolean)}
                  />
                  <span className={item.completed ? 'line-through text-gray-500' : ''}>
                    {item.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  )
}
