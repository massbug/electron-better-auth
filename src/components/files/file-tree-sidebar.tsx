import type { TreeNode } from '@/lib/file-tree-collection'
import { ChevronRight, File, Folder, SproutIcon } from 'lucide-react'

import * as React from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useFileActions } from '@/hooks/use-file-tree-actions'
import { useFileTree } from '@/hooks/use-file-tree-queries'
import { seedFileTree } from '@/lib/file-tree-collection'

interface SeedProps {
  onSeed: () => void
}

export function Seed({ onSeed }: SeedProps) {
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

export function FileSidebar({ fileId, ...props }: React.ComponentProps<typeof Sidebar> & {
  fileId?: string
}) {
  const { navigateToFile } = useFileActions()
  const { data: fileTree } = useFileTree()

  return (
    <Sidebar {...props}>
      <Seed onSeed={seedFileTree} />
      <SidebarContent>
        <TreeList tree={fileTree} selectedFileId={fileId} onSelectFile={navigateToFile} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

interface TreeListProps {
  tree: TreeNode[]
  selectedFileId?: string
  onSelectFile: (id: string) => void
}

function TreeList({ tree, selectedFileId, onSelectFile }: TreeListProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Files</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {tree.map(item => (
            <Tree key={item.id} item={item} selectedFileId={selectedFileId} onSelect={onSelectFile} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

interface TreeProps {
  item: TreeNode
  selectedFileId?: string
  onSelect: (id: string) => void
}

function Tree({ item, selectedFileId, onSelect }: TreeProps) {
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
            {item.children.map((subItem: TreeNode) => (
              <Tree key={subItem.id} item={subItem} onSelect={onSelect} selectedFileId={selectedFileId} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}
