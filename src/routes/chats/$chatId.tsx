import { createFileRoute, notFound } from '@tanstack/react-router'
import z from 'zod'
import { ChatView } from '@/components/chat-view'
import { useChatActions } from '@/hooks/use-chat-actions'
import { useChat } from '@/hooks/use-chat-queries'

const chatSearchSchema = z.object({
  query: z.object({
    text: z.string().default(''),
    files: z.array(z.any()).default([]),
  }).optional(),
})

export const Route = createFileRoute('/chats/$chatId')({
  component: RouteComponent,
  validateSearch: chatSearchSchema,
})

function RouteComponent() {
  const search = Route.useSearch()
  const { chatId } = Route.useParams()
  const { updateChat } = useChatActions()

  const { data: chat } = useChat(chatId)

  if (!chat) {
    return notFound()
  }

  return (
    <ChatView
      chatId={chatId}
      initialMessages={chat.messages}
      query={search.query}
      onUpdate={updateChat}
    />
  )
}
