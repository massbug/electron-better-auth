import { createFileRoute, Outlet, useParams } from '@tanstack/react-router'
import { ChatView } from '@/components/chat-view'
import { FileSidebar } from '@/components/files/file-tree-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export const Route = createFileRoute('/files')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = useParams({ strict: false })
  const fileId = params.fileId

  return (
    <SidebarProvider>
      <FileSidebar fileId={fileId} />
      <SidebarInset className="h-screen">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex flex-1 min-h-0">
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
          <div className="flex-1 overflow-auto">
            <ChatView />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
