import { createCollection, localStorageCollectionOptions } from '@tanstack/react-db'

// ============ 基础类型定义 ============
export interface BaseNode {
  id: string
  parentId: string | null // 通过 parentId 建立关系
  createdAt: Date
  modifiedAt: Date
}

// 数据库存储的扁平化节点
export interface FileNode extends BaseNode {
  type: 'file'
  fileName: string // 完整文件名，如 'main.py'
  content: string
  size: number
  isDirty: boolean
}

export interface FolderNode extends BaseNode {
  type: 'folder'
  folderName: string // 文件夹名，如 'leetcode'
}

// 联合类型：数据库存储的节点（扁平化，无 children）
export type StoredNode = FileNode | FolderNode

// ============ UI 渲染类型定义 ============
// 带 children 的树形结构节点
export interface FileTreeNode extends FileNode {}

export interface FolderTreeNode extends FolderNode {
  children: TreeNode[]
}

// 联合类型：UI 渲染的节点（树形，有 children）
export type TreeNode = FileTreeNode | FolderTreeNode

// ============ Collection 定义 ============
export const fileTreeCollection = createCollection(
  localStorageCollectionOptions<StoredNode>({
    id: 'sidebar-file-tree',
    storageKey: 'app-sidebar-file-tree',
    getKey: item => item.id,
  }),
)

// ============ 种子数据 ============
const initialNodes: StoredNode[] = [
  {
    id: 'leetcode',
    folderName: 'leetcode',
    type: 'folder',
    parentId: null,
    createdAt: new Date(),
    modifiedAt: new Date(),
  },
  {
    id: 'two-sum',
    folderName: 'two-sum',
    type: 'folder',
    parentId: 'leetcode',
    createdAt: new Date(),
    modifiedAt: new Date(),
  },
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
    createdAt: new Date(),
    modifiedAt: new Date(),
  },
  {
    id: 'main-tsx',
    fileName: 'main.tsx',
    type: 'file',
    content: `function twoSum(nums: number[], target: number): number[] {
    
};`,
    size: 120,
    isDirty: false,
    parentId: 'two-sum',
    createdAt: new Date(),
    modifiedAt: new Date(),
  },
]

export async function seedFileTree() {
  if (fileTreeCollection.size === 0) {
    for (const node of initialNodes) {
      fileTreeCollection.insert(node)
    }
  }
}

// ============ 辅助函数 ============
// 从文件名提取扩展名
export function getFileExtension(fileName: string): string {
  const match = fileName.match(/\.([^.]+)$/)
  return match ? match[0] : ''
}

// 从文件名提取基础名（不含扩展名）
export function getBaseName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, '')
}

// 获取 Monaco Editor 语言标识符
export function getMonacoLanguage(fileName: string): string {
  const ext = getFileExtension(fileName).toLowerCase()
  const languageMap: Record<string, string> = {
    '.py': 'python',
    '.tsx': 'typescript',
    '.ts': 'typescript',
    '.jsx': 'javascript',
    '.js': 'javascript',
    '.json': 'json',
    '.md': 'markdown',
    '.css': 'css',
    '.html': 'html',
    '.yml': 'yaml',
    '.yaml': 'yaml',
  }
  return languageMap[ext] || 'plaintext'
}
