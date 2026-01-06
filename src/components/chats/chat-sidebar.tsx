'use client'

import * as React from 'react'
import { Sidebar, SidebarContent, SidebarRail } from '@/components/ui/sidebar'
import { useChatActions } from '@/hooks/use-chat-actions'
import { useChatList } from '@/hooks/use-chat-queries'
import { ChatList } from './chat-list'
import { CreateChat } from './create-chat'

export function ChatSidebar({
  chatId,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  chatId?: string
}) {
  const { navigateToChatList, navigateToChat, deleteChat }
    = useChatActions(chatId)
  const { data: chats } = useChatList()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <CreateChat onCreateChat={navigateToChatList} />
        <ChatList
          chats={chats}
          selectedChatId={chatId}
          onSelectChat={navigateToChat}
          onDeleteChat={deleteChat}
        />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
