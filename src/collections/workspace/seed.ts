import type { FileNode, RegularFolderNode, RootFolderNode, StoredNode, Workspace } from './types'
import { fileTreeCollection, workspaceCollection } from './collections'

// ============ 种子数据 ============
const defaultWorkspaceId = 'workspace-default'
const rootFolderId = 'root-default'

const initialWorkspace: Workspace = {
  id: defaultWorkspaceId,
  name: 'Default Workspace',
  rootFolderId,
  createdAt: new Date(),
  modifiedAt: new Date(),
}

const initialNodes: StoredNode[] = [
  {
    id: rootFolderId,
    folderName: 'Default Workspace',
    type: 'folder',
    parentId: null, // RootFolderNode
    workspaceId: defaultWorkspaceId,
    createdAt: new Date(),
    modifiedAt: new Date(),
  } as RootFolderNode,
  {
    id: 'leetcode',
    folderName: 'leetcode',
    type: 'folder',
    parentId: rootFolderId, // RegularFolderNode
    workspaceId: defaultWorkspaceId,
    createdAt: new Date(),
    modifiedAt: new Date(),
  } as RegularFolderNode,
  {
    id: 'two-sum',
    folderName: 'two-sum',
    type: 'folder',
    parentId: 'leetcode', // RegularFolderNode
    workspaceId: defaultWorkspaceId,
    createdAt: new Date(),
    modifiedAt: new Date(),
  } as RegularFolderNode,
  {
    id: 'main-py',
    fileName: 'main.py',
    type: 'file',
    content: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        `,
    size: 100,
    isDirty: false,
    parentId: 'two-sum',
    workspaceId: defaultWorkspaceId,
    createdAt: new Date(),
    modifiedAt: new Date(),
  } as FileNode,
  {
    id: 'main-tsx',
    fileName: 'main.tsx',
    type: 'file',
    content: `function twoSum(nums: number[], target: number): number[] {

};`,
    size: 120,
    isDirty: false,
    parentId: 'two-sum',
    workspaceId: defaultWorkspaceId,
    createdAt: new Date(),
    modifiedAt: new Date(),
  } as FileNode,
]

export async function seedFileTree() {
  // 初始化 workspace
  if (workspaceCollection.size === 0) {
    workspaceCollection.insert(initialWorkspace)
  }

  // 初始化文件树
  if (fileTreeCollection.size === 0) {
    for (const node of initialNodes) {
      fileTreeCollection.insert(node)
    }
  }
}
