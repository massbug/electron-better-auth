import { createFileRoute } from '@tanstack/react-router'
import { ChatView } from '@/components/chat-view'
import { useChatActions } from '@/hooks/use-chat-actions'

export const Route = createFileRoute('/chats/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { createChat } = useChatActions()

  return <ChatView onCreate={createChat} />
}
