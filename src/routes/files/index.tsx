import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/files/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="flex flex-1 items-center justify-center">SELECT A FILE FIRST</div>
}
