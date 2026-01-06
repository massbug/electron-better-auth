import type { FolderTreeNode, RootFolderNode, StoredNode, TreeNode, Workspace } from './types'
import { isRootFolder } from './guards'

// ============ 查询函数 ============
export function getWorkspaceNodes(nodes: StoredNode[], workspaceId: string): StoredNode[] {
  return nodes.filter(node => node.workspaceId === workspaceId)
}

export function getWorkspaceRoot(nodes: StoredNode[], workspace: Workspace): RootFolderNode | undefined {
  const node = nodes.find(n => n.id === workspace.rootFolderId)
  return node && isRootFolder(node) ? node : undefined
}

// 新增：从树形结构中提取根节点的子节点和名称
export function getWorkspaceTreeForDisplay(
  tree: TreeNode[],
): { children: TreeNode[], rootName: string } {
  // 找到根节点（parentId 为 null 的文件夹）
  const rootNode = tree.find(node => isRootFolder(node)) as FolderTreeNode | undefined

  if (!rootNode) {
    return { children: [], rootName: 'Files' }
  }

  return {
    children: rootNode.children,
    rootName: rootNode.folderName,
  }
}
