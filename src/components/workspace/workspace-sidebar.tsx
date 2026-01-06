import * as React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useFileActions } from '@/hooks/use-file-tree-actions'
import { useFileTree } from '@/hooks/use-file-tree-queries'
import { seedFileTree } from '@/collections/workspace'
import { FileTree } from './file-tree'
import { SeedButton } from './seed-button'

export function WorkspaceSidebar({ fileId, ...props }: React.ComponentProps<typeof Sidebar> & {
  fileId?: string
}) {
  const { navigateToFile } = useFileActions()
  const { data: fileTree } = useFileTree()

  return (
    <Sidebar {...props}>
      <SeedButton onSeed={seedFileTree} />
      <SidebarContent>
        <FileTree tree={fileTree} selectedFileId={fileId} onSelectFile={navigateToFile} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
