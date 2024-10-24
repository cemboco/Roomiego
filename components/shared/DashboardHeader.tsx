"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Bell, 
  Settings, 
  User, 
  ShoppingCart, 
  BarChart3
} from "lucide-react"

export default function DashboardHeader() {
  return (
    <header className="bg-white/80 backdrop-blur-md fixed w-full z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
        <Link href="/dashboard">
          <div className="text-3xl font-bold bg-gradient-to-r from-[#4A3E4C] to-[#65C3BA] bg-clip-text text-transparent">
            Roomie
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/shopping-list">
            <Button variant="ghost" className="p-2">
              <ShoppingCart className="h-6 w-6 text-[#4A3E4C] hover:text-[#65C3BA]" />
            </Button>
          </Link>
          <Link href="/statistics">
            <Button variant="ghost" className="p-2">
              <BarChart3 className="h-6 w-6 text-[#4A3E4C] hover:text-[#65C3BA]" />
            </Button>
          </Link>
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
  )
}
