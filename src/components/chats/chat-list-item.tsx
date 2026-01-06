import type { Chat } from '@/lib/chat-collection'
import { MoreHorizontalIcon, Trash2Icon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

interface ChatListItemProps {
  chat: Chat
  isSelected: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export function ChatListItem({
  chat,
  isSelected,
  onSelect,
  onDelete,
}: ChatListItemProps) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenuItem key={chat.id}>
      <SidebarMenuButton
        asChild
        isActive={isSelected}
        onClick={() => onSelect(chat.id)}
      >
        <span className="cursor-pointer">{chat.title}</span>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontalIcon />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 rounded-lg"
          side={isMobile ? 'bottom' : 'right'}
          align={isMobile ? 'end' : 'start'}
        >
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onDelete(chat.id)
            }}
          >
            <Trash2Icon className="text-muted-foreground" />
            <span>Delete Chat</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}
