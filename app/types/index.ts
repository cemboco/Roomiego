export interface Task {
  id: string
  title: string
  assigned_to: string
  created_by: string
  household_id: string
  due_date: string | null
  quick_action_minutes: number | null
  completed: boolean
  start_time: string | null
  completed_at: string | null
}

export interface UserProfile {
  id: string
  full_name: string | null
  email: string
  avatar_url?: string
  points: number
  household_id: string
}
