import type { TreeNode } from '@/collections/workspace'
import { ChevronRight, File, Folder } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar'

interface FileTreeProps {
  tree: TreeNode[]
  label?: string
  selectedFileId?: string
  onSelectFile: (id: string) => void
}

export function FileTree({ tree, label = 'Files', selectedFileId, onSelectFile }: FileTreeProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {tree.map(item => (
            <FileTreeItem key={item.id} item={item} selectedFileId={selectedFileId} onSelect={onSelectFile} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

interface FileTreeItemProps {
  item: TreeNode
  selectedFileId?: string
  onSelect: (id: string) => void
}

function FileTreeItem({ item, selectedFileId, onSelect }: FileTreeItemProps) {
  if (item.type === 'file') {
    return (
      <SidebarMenuButton
        isActive={item.id === selectedFileId}
        onClick={() => onSelect(item.id)}
      >
        <File />
        {item.fileName}
      </SidebarMenuButton>
    )
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen={item.folderName === 'components' || item.folderName === 'ui'}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRight className="transition-transform" />
            <Folder />
            {item.folderName}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children.map((childItem: TreeNode) => (
              <FileTreeItem key={childItem.id} item={childItem} onSelect={onSelect} selectedFileId={selectedFileId} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}
