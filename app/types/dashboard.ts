export interface Task {
  id: string
  title: string
  assignedTo: string
  createdBy: string
  dueDate: string | null
  quickActionMinutes: number | null
  completed: boolean
  startTime: string | null
}

export interface UserProfile {
  id: string
  name: string
  email: string
  profilePicture?: string
  points: number
}
