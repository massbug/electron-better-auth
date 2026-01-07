// src/lib/tab-render-utils.tsx

import type { EditorMetadata, TabConfig } from '@/types/tab'
import { DirtyIndicator, GitStatusIndicator } from '@/components/tab-render-components'
import { FileIcon } from '@/lib/file-icon'

/**
 * 渲染 Tab 图标
 */
export function renderTabIcon(config: TabConfig) {
  if (!config.icon)
    return null

  // 如果指定了 React 组件
  if (config.icon.component) {
    const Icon = config.icon.component
    return <Icon size={16} className="mr-1.5" />
  }

  // 如果指定了文件扩展名或文件名
  if (config.icon.extension || config.icon.filename) {
    return (
      <FileIcon
        extension={config.icon.extension}
        filename={config.icon.filename}
        size={16}
        className="mr-1.5"
      />
    )
  }

  return null
}

/**
 * 渲染编辑器 Tab 的状态指示器
 */
export function renderEditorIndicators(metadata: EditorMetadata, buttons: React.ReactNode[]) {
  // Git 状态
  if (metadata.gitStatus) {
    buttons.push(
      <GitStatusIndicator
        key="git-status"
        status={metadata.gitStatus}
      />,
    )
  }

  // 未保存状态
  if (metadata.isDirty) {
    buttons.push(
      <DirtyIndicator key="dirty-indicator" />,
    )
  }
}
