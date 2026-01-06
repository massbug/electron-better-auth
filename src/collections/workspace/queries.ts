import type { RootFolderNode, StoredNode, Workspace } from './types'
import { isRootFolder } from './guards'

// ============ 查询函数 ============
export function getWorkspaceNodes(nodes: StoredNode[], workspaceId: string): StoredNode[] {
  return nodes.filter(node => node.workspaceId === workspaceId)
}

export function getWorkspaceRoot(nodes: StoredNode[], workspace: Workspace): RootFolderNode | undefined {
  const node = nodes.find(n => n.id === workspace.rootFolderId)
  return node && isRootFolder(node) ? node : undefined
}
