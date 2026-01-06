import type { FileNode, RegularFolderNode, RootFolderNode, StoredNode, Workspace } from './types'
import { isFolder, isRootFolder } from './guards'

// ============ 创建函数 ============
export function createWorkspace(name: string) {
  const workspaceId = `workspace-${Date.now()}`
  const rootFolderId = `root-${workspaceId}`
  const now = new Date()

  const workspace: Workspace = {
    id: workspaceId,
    name,
    rootFolderId,
    createdAt: now,
    modifiedAt: now,
  }

  const rootFolder: RootFolderNode = {
    id: rootFolderId,
    type: 'folder',
    folderName: name,
    parentId: null, // 类型系统确保这里必须是 null
    workspaceId,
    createdAt: now,
    modifiedAt: now,
  }

  return { workspace, rootFolder }
}

export function createFileNode(
  fileName: string,
  content: string,
  parentId: string, // 类型确保不能为 null
  workspaceId: string,
): FileNode {
  return {
    id: `file-${Date.now()}-${Math.random()}`,
    type: 'file',
    fileName,
    content,
    size: content.length,
    isDirty: false,
    parentId,
    workspaceId,
    createdAt: new Date(),
    modifiedAt: new Date(),
  }
}

export function createRegularFolder(
  folderName: string,
  parentId: string, // 类型确保不能为 null
  workspaceId: string,
): RegularFolderNode {
  return {
    id: `folder-${Date.now()}-${Math.random()}`,
    type: 'folder',
    folderName,
    parentId,
    workspaceId,
    createdAt: new Date(),
    modifiedAt: new Date(),
  }
}

// ============ 验证函数 ============
export function validateNode(
  node: StoredNode,
  allNodes: StoredNode[],
  workspace: Workspace,
): { valid: boolean, error?: string } {
  // 根文件夹验证
  if (isRootFolder(node)) {
    if (node.id !== workspace.rootFolderId) {
      return { valid: false, error: 'Root folder ID does not match workspace' }
    }
    return { valid: true }
  }

  // 文件和普通文件夹验证：必须有有效的父节点
  const parent = allNodes.find(n => n.id === node.parentId)
  if (!parent) {
    return { valid: false, error: `Parent node ${node.parentId} not found` }
  }

  if (!isFolder(parent)) {
    return { valid: false, error: 'Parent must be a folder' }
  }

  if (parent.workspaceId !== node.workspaceId) {
    return { valid: false, error: 'Parent and child must be in the same workspace' }
  }

  return { valid: true }
}
