import type { LucideIcon } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import { FlexLayout } from '@/components/flexlayout'
import { useWorkspaceFlexLayoutStore } from '@/hooks/use-workspace-flexlayout-store'

export const Route = createFileRoute('/workspace/$workspaceId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { jsonModel, realtimeResize, setJsonModel } = useWorkspaceFlexLayoutStore()

  const icons: Record<string, LucideIcon> = {
  }

  const components: Record<string, React.ReactNode> = {
  }

  return (
    <FlexLayout
      icons={icons}
      components={components}
      jsonModel={jsonModel}
      setJsonModel={setJsonModel}
      realtimeResize={realtimeResize}
    />
  )
}
