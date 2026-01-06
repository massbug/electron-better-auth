// ============ Workspace 定义 ============
export interface Workspace {
  id: string
  name: string
  rootFolderId: string
  createdAt: Date
  modifiedAt: Date
}

// ============ 基础类型定义 ============
interface BaseNode {
  id: string
  workspaceId: string
  createdAt: Date
  modifiedAt: Date
}

// ============ 存储层类型（扁平化）============
// 文件节点：必须有父节点
export interface FileNode extends BaseNode {
  type: 'file'
  fileName: string
  content: string
  size: number
  isDirty: boolean
  parentId: string // 永远不为 null
}

// 根文件夹节点：parentId 必须为 null
export interface RootFolderNode extends BaseNode {
  type: 'folder'
  folderName: string
  parentId: null // 必须为 null
}

// 普通文件夹节点：必须有父节点
export interface RegularFolderNode extends BaseNode {
  type: 'folder'
  folderName: string
  parentId: string // 永远不为 null
}

// 文件夹的联合类型
export type FolderNode = RootFolderNode | RegularFolderNode

// 所有存储节点的联合类型
export type StoredNode = FileNode | RootFolderNode | RegularFolderNode

// ============ UI 层类型（树形结构）============
export type FileTreeNode = FileNode

export interface RootFolderTreeNode extends RootFolderNode {
  children: TreeNode[]
}

export interface RegularFolderTreeNode extends RegularFolderNode {
  children: TreeNode[]
}

export type FolderTreeNode = RootFolderTreeNode | RegularFolderTreeNode

export type TreeNode = FileTreeNode | FolderTreeNode
