import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-screen flex items-center justify-center">
      Select A Workspace
    </div>
  )
}
