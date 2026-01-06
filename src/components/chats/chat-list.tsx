import type { Chat } from '@/collections/chat'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar'
import { ChatListItem } from './chat-list-item'

interface ChatListProps {
  chats: Chat[]
  selectedChatId?: string
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
}

export function ChatList({
  chats,
  selectedChatId,
  onSelectChat,
  onDeleteChat,
}: ChatListProps) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarMenu>
        {chats.map(chat => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isSelected={selectedChatId === chat.id}
            onSelect={onSelectChat}
            onDelete={onDeleteChat}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
