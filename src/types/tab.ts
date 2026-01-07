// src/types/tab.ts

import type { ComponentType } from 'react'

/**
 * Tab 可以承载的内容类型
 */
export type TabContentType = 'editor' | 'chat' | 'terminal' | 'preview' | 'settings' | 'welcome'

/**
 * 文件的 Git 状态
 */
export type FileGitStatus = 'added' | 'modified' | 'deleted' | 'unstaged' | 'untracked'

/**
 * Tab 图标配置
 */
export interface TabIcon {
  // 使用 React 组件作为图标（如 BotIcon）
  component?: ComponentType<{ size?: number, className?: string }>
  // 或者使用文件扩展名匹配图标
  extension?: string
  // 或者使用完整文件名匹配图标
  filename?: string
}

/**
 * 编辑器 Tab 的元数据
 */
export interface EditorMetadata {
  fileId: string // 关联的文件 ID
  filePath: string // 文件路径（用于显示）
  language: string // 编程语言
  content: string // 文件内容
  isDirty: boolean // 是否有未保存的修改
  gitStatus?: FileGitStatus // Git 状态
  cursorPosition?: { // 光标位置（用于恢复）
    line: number
    column: number
  }
}

/**
 * AI 聊天 Tab 的元数据
 */
export interface ChatMetadata {
  conversationId: string // 会话 ID
  model: string // 使用的模型
  title: string // 对话标题
  messageCount: number // 消息数量
  createdAt: Date
}

/**
 * 终端 Tab 的元数据
 */
export interface TerminalMetadata {
  sessionId: string // 终端会话 ID
  cwd: string // 当前工作目录
  shellType: string // shell 类型（bash, zsh, etc）
}

/**
 * 预览 Tab 的元数据（用于预览 Markdown、HTML 等）
 */
export interface PreviewMetadata {
  sourceFileId?: string // 源文件 ID（如果是文件预览）
  content: string // 预览内容
  previewType: 'markdown' | 'html' | 'pdf' | 'image'
}

/**
 * 设置 Tab 的元数据
 */
export interface SettingsMetadata {
  section: string // 设置页面的哪个部分
}

/**
 * 欢迎页 Tab 的元数据
 */
export interface WelcomeMetadata {
  showRecentProjects: boolean
}

/**
 * 元数据类型映射
 */
export interface TabMetadataMap {
  editor: EditorMetadata
  chat: ChatMetadata
  terminal: TerminalMetadata
  preview: PreviewMetadata
  settings: SettingsMetadata
  welcome: WelcomeMetadata
}

/**
 * 通用 Tab 配置接口
 */
export interface TabConfig<T extends TabContentType = TabContentType> {
  id: string // Tab 的唯一 ID
  type: T // 内容类型
  title: string // 显示标题
  icon?: TabIcon // 图标配置
  metadata: TabMetadataMap[T] // 类型特定的元数据
  closable?: boolean // 是否可关闭（默认 true）
  pinned?: boolean // 是否固定（默认 false）
}

/**
 * 类型安全的 Tab 配置创建辅助函数
 */
export function createTabConfig<T extends TabContentType>(
  type: T,
  config: Omit<TabConfig<T>, 'type'>,
): TabConfig<T> {
  return {
    type,
    ...config,
  }
}
