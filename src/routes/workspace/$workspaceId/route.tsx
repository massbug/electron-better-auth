import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { WorkspaceSidebar } from '@/components/workspace/workspace-sidebar'

export const Route = createFileRoute('/workspace/$workspaceId')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <WorkspaceSidebar />
      <SidebarInset className="h-screen">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex flex-1 min-h-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
