import type { FileNode, FolderNode, RegularFolderNode, RootFolderNode, StoredNode } from './types'

// ============ 类型守卫 ============
export function isFile(node: StoredNode): node is FileNode {
  return node.type === 'file'
}

export function isRootFolder(node: StoredNode): node is RootFolderNode {
  return node.type === 'folder' && node.parentId === null
}

export function isRegularFolder(node: StoredNode): node is RegularFolderNode {
  return node.type === 'folder' && node.parentId !== null
}

export function isFolder(node: StoredNode): node is FolderNode {
  return node.type === 'folder'
}
