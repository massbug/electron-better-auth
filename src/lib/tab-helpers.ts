// src/lib/tab-helpers.ts

import type { File } from '@/types/file'
import type {
  ChatMetadata,
  EditorMetadata,
  TabConfig,
  TerminalMetadata,
} from '@/types/tab'
import { BotIcon, FileTextIcon, SettingsIcon, TerminalIcon } from 'lucide-react'
import { getFullFileName } from '@/types/file'

/**
 * 从文件创建编辑器 Tab 配置
 */
export function createEditorTabFromFile(file: File): TabConfig<'editor'> {
  return {
    id: `editor-${file.id}`,
    type: 'editor',
    title: getFullFileName(file),
    icon: {
      extension: file.extension,
      filename: getFullFileName(file),
    },
    metadata: {
      fileId: file.id,
      filePath: file.path,
      language: file.language,
      content: file.content,
      isDirty: false,
      gitStatus: file.gitStatus,
    },
    closable: true,
    pinned: false,
  }
}

/**
 * 创建 AI 聊天 Tab 配置
 */
export function createChatTab(params: {
  conversationId?: string
  title?: string
  model?: string
}): TabConfig<'chat'> {
  const conversationId = params.conversationId || `chat-${Date.now()}`

  return {
    id: `chat-${conversationId}`,
    type: 'chat',
    title: params.title || 'AI Chat',
    icon: {
      component: BotIcon,
    },
    metadata: {
      conversationId,
      model: params.model || 'claude-sonnet-4',
      title: params.title || 'New Conversation',
      messageCount: 0,
      createdAt: new Date(),
    },
    closable: true,
    pinned: false,
  }
}

/**
 * 创建终端 Tab 配置
 */
export function createTerminalTab(params: {
  sessionId?: string
  cwd?: string
  shellType?: string
}): TabConfig<'terminal'> {
  const sessionId = params.sessionId || `terminal-${Date.now()}`

  return {
    id: `terminal-${sessionId}`,
    type: 'terminal',
    title: 'Terminal',
    icon: {
      component: TerminalIcon,
    },
    metadata: {
      sessionId,
      cwd: params.cwd || '~',
      shellType: params.shellType || 'bash',
    },
    closable: true,
    pinned: false,
  }
}

/**
 * 创建预览 Tab 配置
 */
export function createPreviewTab(params: {
  sourceFileId?: string
  content: string
  previewType: 'markdown' | 'html' | 'pdf' | 'image'
  title?: string
}): TabConfig<'preview'> {
  return {
    id: `preview-${params.sourceFileId || Date.now()}`,
    type: 'preview',
    title: params.title || 'Preview',
    icon: {
      component: FileTextIcon,
    },
    metadata: {
      sourceFileId: params.sourceFileId,
      content: params.content,
      previewType: params.previewType,
    },
    closable: true,
    pinned: false,
  }
}

/**
 * 创建设置 Tab 配置
 */
export function createSettingsTab(section: string = 'general'): TabConfig<'settings'> {
  return {
    id: 'settings',
    type: 'settings',
    title: 'Settings',
    icon: {
      component: SettingsIcon,
    },
    metadata: {
      section,
    },
    closable: true,
    pinned: false,
  }
}

/**
 * 创建欢迎页 Tab 配置
 */
export function createWelcomeTab(): TabConfig<'welcome'> {
  return {
    id: 'welcome',
    type: 'welcome',
    title: 'Welcome',
    icon: undefined,
    metadata: {
      showRecentProjects: true,
    },
    closable: false,
    pinned: false,
  }
}

/**
 * 检查两个 Tab 是否指向同一个资源
 * 用于防止重复打开
 */
export function isSameTabResource(tab1: TabConfig, tab2: TabConfig): boolean {
  if (tab1.type !== tab2.type)
    return false

  switch (tab1.type) {
    case 'editor': {
      if (tab2.type !== 'editor')
        return false
      const meta1 = tab1.metadata as EditorMetadata
      const meta2 = tab2.metadata as EditorMetadata
      return meta1.fileId === meta2.fileId
    }
    case 'chat': {
      if (tab2.type !== 'chat')
        return false
      const meta1 = tab1.metadata as ChatMetadata
      const meta2 = tab2.metadata as ChatMetadata
      return meta1.conversationId === meta2.conversationId
    }
    case 'terminal': {
      if (tab2.type !== 'terminal')
        return false
      const meta1 = tab1.metadata as TerminalMetadata
      const meta2 = tab2.metadata as TerminalMetadata
      return meta1.sessionId === meta2.sessionId
    }
    case 'settings':
      return true // Only one settings tab
    case 'welcome':
      return true // Only one welcome tab
    default:
      return tab1.id === tab2.id
  }
}
