import { eq, useLiveQuery } from '@tanstack/react-db'
import { chatCollection } from '@/lib/chat-collection'

export function useChatList() {
  return useLiveQuery(q =>
    q
      .from({ chat: chatCollection })
      .orderBy(({ chat }) => chat.updatedAt, 'desc'),
  )
}

export function useChat(chatId: string) {
  return useLiveQuery(
    q =>
      q
        .from({ chat: chatCollection })
        .where(({ chat }) => eq(chat.id, chatId))
        .findOne(),
    [chatId],
  )
}
