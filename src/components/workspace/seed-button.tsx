import { SproutIcon } from 'lucide-react'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

interface SeedButtonProps {
  onSeed: () => void
}

export function SeedButton({ onSeed }: SeedButtonProps) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={() => onSeed()}>
            <SproutIcon />
            <span>Seed</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
