import type { MyMessage } from 'electron/tools'
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input'
import { useNavigate } from '@tanstack/react-router'
import { chatCollection } from '@/lib/chat-collection'

export function useChatActions(currentChatId?: string) {
  const navigate = useNavigate()

  const navigateToChatList = () => {
    navigate({
      to: '/chats',
    })
  }

  const navigateToChat = (chatId: string, query?: PromptInputMessage) => {
    navigate({
      to: '/chats/$chatId',
      params: { chatId },
      search: {
        query,
      },
    })
  }

  const createChat = async (query: PromptInputMessage) => {
    const newChat = {
      id: crypto.randomUUID(),
      title: query.text,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const tx = chatCollection.insert(newChat)
    await tx.isPersisted.promise

    navigateToChat(newChat.id, query)
  }

  const updateChat = async (chatId: string, messages: MyMessage[]) => {
    const tx = chatCollection.update(chatId, (draft) => {
      draft.messages = messages
      draft.updatedAt = new Date()
    })
    await tx.isPersisted.promise
  }

  const deleteChat = (chatId: string) => {
    chatCollection.delete(chatId)
    if (currentChatId === chatId) {
      navigate({ to: '/chats' })
    }
  }

  return {
    navigateToChatList,
    navigateToChat,
    createChat,
    updateChat,
    deleteChat,
  }
}
