import type { FileTreeNode, FolderTreeNode, TreeNode } from '@/lib/file-tree-collection'
import { and, eq, useLiveQuery } from '@tanstack/react-db'
import { fileTreeCollection } from '@/lib/file-tree-collection'

// 获取根节点
export function useRootNodes() {
  return useLiveQuery(q =>
    q.from({ node: fileTreeCollection })
      .where(({ node }) => eq(node.parentId, null)),
  )
}

// 获取指定父节点的子节点
export function useChildNodes(parentId: string | null) {
  return useLiveQuery(
    q => q.from({ node: fileTreeCollection })
      .where(({ node }) => eq(node.parentId, parentId)),
    [parentId],
  )
}

// 获取单个文件
export function useFile(fileId: string) {
  return useLiveQuery(
    q => q.from({ file: fileTreeCollection })
      .where(({ file }) => and(
        eq(file.id, fileId),
        eq(file.type, 'file'),
      ))
      .findOne(),
    [fileId],
  )
}

// 获取完整树形结构(用于渲染)
export function useFileTree() {
  const { data: allNodes } = useLiveQuery(q =>
    q.from({ node: fileTreeCollection }),
  )

  // 在客户端重建树形结构
  const buildTree = (parentId: string | null = null): TreeNode[] => {
    return allNodes
      .filter(node => node.parentId === parentId)
      .map((node) => {
        if (node.type === 'folder') {
          return {
            ...node,
            children: buildTree(node.id),
          } as FolderTreeNode
        }
        return node as FileTreeNode
      })
  }

  return { data: buildTree() }
}
