// src/components/tab-components.tsx

import type { TabConfig } from '@/types/tab'
import { Editor } from '@monaco-editor/react'
import { BotIcon, SettingsIcon } from 'lucide-react'

/**
 * 编辑器 Tab 组件
 */
export function EditorTab({ config }: { config: TabConfig<'editor'> }) {
  const { metadata } = config

  return (
    <Editor
      theme="vs-dark"
      language={metadata.language}
      value={metadata.content}
      options={{
        minimap: {
          enabled: false,
        },
        padding: {
          top: 8,
        },
      }}
      // 可以添加 onChange 来更新 isDirty 状态
    />
  )
}

/**
 * AI 聊天 Tab 组件
 */
export function ChatTab({ config }: { config: TabConfig<'chat'> }) {
  const { metadata } = config

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b">
        <BotIcon size={20} />
        <div>
          <h2 className="text-sm font-semibold">{metadata.title}</h2>
          <p className="text-xs text-muted-foreground">
            {metadata.model}
            {' '}
            ·
            {metadata.messageCount}
            {' '}
            messages
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {/* Chat messages UI here */}
        <p className="text-sm text-muted-foreground">Chat interface coming soon...</p>
      </div>
    </div>
  )
}

/**
 * 终端 Tab 组件
 */
export function TerminalTab({ config }: { config: TabConfig<'terminal'> }) {
  const { metadata } = config

  return (
    <div className="flex flex-col h-full bg-black text-white font-mono p-4">
      <div className="text-xs text-gray-400 mb-2">
        {metadata.shellType}
        {' '}
        -
        {metadata.cwd}
      </div>
      <div className="flex-1 overflow-auto">
        {/* Terminal UI here */}
        <p>Terminal interface coming soon...</p>
      </div>
    </div>
  )
}

/**
 * 预览 Tab 组件
 */
export function PreviewTab({ config }: { config: TabConfig<'preview'> }) {
  const { metadata } = config

  return (
    <div className="h-full overflow-auto p-4">
      <div className="text-sm text-muted-foreground mb-4">
        Preview:
        {' '}
        {metadata.previewType}
      </div>
      {/* Render preview based on type */}
      <div dangerouslySetInnerHTML={{ __html: metadata.content }} />
    </div>
  )
}

/**
 * 设置 Tab 组件
 */
export function SettingsTab({ config }: { config: TabConfig<'settings'> }) {
  const { metadata } = config

  return (
    <div className="h-full overflow-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon size={24} />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Section:
          {' '}
          {metadata.section}
        </p>
        {/* Settings UI here */}
      </div>
    </div>
  )
}

/**
 * 欢迎页 Tab 组件
 */
export function WelcomeTab({ config }: { config: TabConfig<'welcome'> }) {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Workspace</h1>
        <p className="text-muted-foreground mb-8">
          Start by opening a file or creating a new one
        </p>
        {config.metadata.showRecentProjects && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
            {/* Recent projects list */}
          </div>
        )}
      </div>
    </div>
  )
}
