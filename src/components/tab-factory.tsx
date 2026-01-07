// src/components/tab-factory.tsx

import type { TabNode } from '@massbug/flexlayout-react'
import type { TabConfig } from '@/types/tab'
import {
  ChatTab,
  EditorTab,
  PreviewTab,
  SettingsTab,
  TerminalTab,
  WelcomeTab,
} from './tab-components'

/**
 * Tab Factory - 根据 Tab 类型渲染对应的组件
 */
export function createTabFactory() {
  return (node: TabNode) => {
    const config = node.getConfig() as TabConfig

    if (!config || !config.type) {
      return <div className="p-4 text-destructive">Invalid tab configuration</div>
    }

    switch (config.type) {
      case 'editor':
        return <EditorTab config={config as TabConfig<'editor'>} />

      case 'chat':
        return <ChatTab config={config as TabConfig<'chat'>} />

      case 'terminal':
        return <TerminalTab config={config as TabConfig<'terminal'>} />

      case 'preview':
        return <PreviewTab config={config as TabConfig<'preview'>} />

      case 'settings':
        return <SettingsTab config={config as TabConfig<'settings'>} />

      case 'welcome':
        return <WelcomeTab config={config as TabConfig<'welcome'>} />

      default: {
        const exhaustiveCheck: never = config.type
        return (
          <div className="p-4 text-destructive">
            Unknown tab type:
            {' '}
            {exhaustiveCheck}
          </div>
        )
      }
    }
  }
}
