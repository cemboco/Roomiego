import { Toast } from "./use-toast"

export function Toaster({ toast }: { toast: Toast | null }) {
  if (!toast) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-md shadow-lg">
      <h3 className="font-bold">{toast.title}</h3>
      {toast.description && <p>{toast.description}</p>}
    </div>
  )
}
