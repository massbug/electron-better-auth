import * as React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useFileTree } from '@/hooks/use-file-tree-queries'
import { FileTree } from './file-tree'

export function WorkspaceSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: fileTree, rootName } = useFileTree()

  return (
    <Sidebar {...props}>
      <SidebarContent>
        <FileTree
          tree={fileTree}
          label={rootName}
        />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
