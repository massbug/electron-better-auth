import { createFileRoute } from '@tanstack/react-router'
import { ChatSection } from '@/components/chat-section'
import { useChatActions } from '@/hooks/use-chat-actions'

export const Route = createFileRoute('/chats/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { createChat } = useChatActions()

  return <ChatSection onCreate={createChat} />
}
