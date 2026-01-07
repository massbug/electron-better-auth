// src/components/tab-renderer.tsx

import type { ITabRenderValues, TabNode } from '@massbug/flexlayout-react'
import type { EditorMetadata, TabConfig } from '@/types/tab'
import { renderEditorIndicators, renderTabIcon } from '@/lib/tab-render-utils'

/**
 * 创建 Tab 渲染函数
 */
export function createTabRenderer() {
  return (node: TabNode, renderValues: ITabRenderValues) => {
    const config = node.getConfig() as TabConfig

    if (!config)
      return

    // 渲染图标
    const icon = renderTabIcon(config)
    if (icon) {
      renderValues.leading = icon
    }

    // 渲染标题
    renderValues.content = (
      <span className="text-xs truncate max-w-[200px]">
        {config.title}
      </span>
    )

    // 根据 Tab 类型添加状态指示器
    switch (config.type) {
      case 'editor': {
        const metadata = config.metadata as EditorMetadata
        renderEditorIndicators(metadata, renderValues.buttons)
        break
      }

      case 'chat': {
        // Chat tabs 可以显示未读消息数等
        // const metadata = config.metadata as ChatMetadata
        // if (metadata.unreadCount > 0) {
        //   renderValues.buttons.push(...)
        // }
        break
      }

      // 其他类型的 Tab 可以添加自己的指示器
      default:
        break
    }

    // 如果 Tab 被固定，可以添加固定图标
    if (config.pinned) {
      // renderValues.buttons.unshift(<PinIcon key="pinned" size={12} />)
    }
  }
}
