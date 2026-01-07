// src/types/file.ts

import type { FileGitStatus } from './tab'

/**
 * 文件系统中的文件（与 Tab 解耦）
 */
export interface File {
  id: string // 文件唯一 ID
  name: string // 文件名（不含扩展名）
  extension: string // 扩展名（含点，如 '.tsx'）
  path: string // 完整路径
  content: string // 文件内容
  language: string // 编程语言
  gitStatus?: FileGitStatus // Git 状态
  lastModified: Date // 最后修改时间
  size: number // 文件大小（字节）
}

/**
 * 文件夹
 */
export interface Folder {
  id: string
  name: string
  path: string
  children: (File | Folder)[]
  expanded?: boolean
}

/**
 * 文件树节点（联合类型）
 */
export type FileTreeNode = File | Folder

/**
 * 判断是否为文件
 */
export function isFile(node: FileTreeNode): node is File {
  return 'content' in node
}

/**
 * 判断是否为文件夹
 */
export function isFolder(node: FileTreeNode): node is Folder {
  return 'children' in node
}

/**
 * 获取文件的完整名称（含扩展名）
 */
export function getFullFileName(file: File): string {
  return `${file.name}${file.extension}`
}

/**
 * 从路径中提取文件名和扩展名
 */
export function parseFilePath(path: string): { name: string, extension: string } {
  const parts = path.split('/')
  const fullName = parts[parts.length - 1]
  const lastDotIndex = fullName.lastIndexOf('.')

  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return { name: fullName, extension: '' }
  }

  return {
    name: fullName.slice(0, lastDotIndex),
    extension: fullName.slice(lastDotIndex),
  }
}
