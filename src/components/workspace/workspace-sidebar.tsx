import * as React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useFileActions } from '@/hooks/use-file-tree-actions'
import { useFileTree } from '@/hooks/use-file-tree-queries'
import { FileTree } from './file-tree'

export function WorkspaceSidebar({ fileId, ...props }: React.ComponentProps<typeof Sidebar> & {
  fileId?: string
}) {
  const { navigateToFile } = useFileActions()
  const { data: fileTree, rootName } = useFileTree()

  return (
    <Sidebar {...props}>
      <SidebarContent>
        <FileTree
          tree={fileTree}
          label={rootName}
          selectedFileId={fileId}
          onSelectFile={navigateToFile}
        />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
