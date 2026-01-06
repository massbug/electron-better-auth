import { createFileRoute, redirect } from '@tanstack/react-router'
import { seedFileTree } from '@/collections/workspace'

export const Route = createFileRoute('/workspace/')({
  loader: async () => {
    await seedFileTree()
    throw redirect({
      to: '/workspace/$workspaceId',
      params: { workspaceId: 'workspace-default' },
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-screen flex items-center justify-center">
      Select A Workspace
    </div>
  )
}
