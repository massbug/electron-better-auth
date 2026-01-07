// src/components/tab-render-components.tsx

import { CircleIcon } from 'lucide-react'

/**
 * Git 状态指示器组件
 */
export function GitStatusIndicator({ status }: { status: string }) {
  const statusConfig = {
    added: { label: 'A', className: 'text-green-600' },
    modified: { label: 'M', className: 'text-yellow-600' },
    deleted: { label: 'D', className: 'text-red-600' },
    unstaged: { label: 'U', className: 'text-blue-600' },
    untracked: { label: '?', className: 'text-gray-600' },
  }

  const config = statusConfig[status as keyof typeof statusConfig]
  if (!config)
    return null

  return (
    <span className={`text-xs mr-1 ${config.className}`}>
      {config.label}
    </span>
  )
}

/**
 * 未保存指示器组件
 */
export function DirtyIndicator() {
  return (
    <CircleIcon
      size={8}
      className="fill-current text-foreground mr-1"
      aria-label="Unsaved changes"
    />
  )
}
