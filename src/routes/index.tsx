// src/routes/index.tsx

import type { BorderNode, IJsonModel, ITabSetRenderValues, TabNode } from '@massbug/flexlayout-react'
import type { File } from '@/types/file'
import { Actions, DockLocation, Layout, Model, TabSetNode } from '@massbug/flexlayout-react'
import { createFileRoute } from '@tanstack/react-router'
import { BotIcon, Columns2Icon, MoreHorizontalIcon, PlusIcon, XIcon } from 'lucide-react'
import { useEffect } from 'react'
import { seedFileTree } from '@/collections/workspace'
import { createTabFactory } from '@/components/tab-factory'
import { createTabRenderer } from '@/components/tab-renderer'
import { Button } from '@/components/ui/button'
import {
  createChatTab,
  createEditorTabFromFile,
  createTerminalTab,
  createWelcomeTab,
} from '@/lib/tab-helpers'
import '@/styles/flexlayout.css'

export const Route = createFileRoute('/')({
  loader: async () => await seedFileTree(),
  component: RouteComponent,
})

const config: IJsonModel = {
  global: {
    tabSetMinWidth: 36,
    tabSetMinHeight: 36,
    tabEnableRename: false,
  },
  layout: {
    type: 'row',
    children: [],
  },
}

// 模拟文件数据（这些应该来自你的文件系统）
const mockFiles: File[] = [
  {
    id: 'file-uuid1',
    name: 'main',
    extension: '.tsx',
    path: '/src/main.tsx',
    content: 'import React from "react"\n\nfunction App() {\n  return <div>Hello World</div>\n}',
    language: 'typescript',
    gitStatus: 'added',
    lastModified: new Date(),
    size: 1024,
  },
  {
    id: 'file-uuid2',
    name: 'main',
    extension: '.py',
    path: '/src/main.py',
    content: 'def main():\n    print("Hello World")\n\nif __name__ == "__main__":\n    main()',
    language: 'python',
    gitStatus: 'modified',
    lastModified: new Date(),
    size: 512,
  },
  {
    id: 'file-uuid3',
    name: 'main',
    extension: '.rs',
    path: '/src/main.rs',
    content: 'fn main() {\n    println!("Hello World!");\n}',
    language: 'rust',
    gitStatus: 'unstaged',
    lastModified: new Date(),
    size: 256,
  },
  {
    id: 'file-uuid4',
    name: 'Dockerfile',
    extension: '',
    path: '/Dockerfile',
    content: 'FROM node:18-alpine\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD ["npm", "start"]',
    language: 'dockerfile',
    lastModified: new Date(),
    size: 128,
  },
]

function RouteComponent() {
  const model = Model.fromJson(config)

  useEffect(() => {
    const firstTabSet = model.getFirstTabSet()
    if (firstTabSet && firstTabSet.getChildren().length === 0) {
      // 添加欢迎页
      const welcomeTab = createWelcomeTab()
      model.doAction(
        Actions.addNode(
          {
            type: 'tab',
            name: welcomeTab.title,
            component: 'generic', // 使用通用组件类型
            config: welcomeTab,
          },
          firstTabSet.getId(),
          DockLocation.CENTER,
          -1,
        ),
      )

      // 添加文件编辑器 tabs
      mockFiles.forEach((file) => {
        const tabConfig = createEditorTabFromFile(file)
        model.doAction(
          Actions.addNode(
            {
              type: 'tab',
              name: tabConfig.title,
              component: 'generic',
              config: tabConfig,
            },
            firstTabSet.getId(),
            DockLocation.CENTER,
            -1,
          ),
        )
      })

      // 添加一个 AI 聊天 tab 作为示例
      const chatTab = createChatTab({
        title: 'Code Assistant',
        model: 'claude-sonnet-4',
      })
      model.doAction(
        Actions.addNode(
          {
            type: 'tab',
            name: chatTab.title,
            component: 'generic',
            config: chatTab,
          },
          firstTabSet.getId(),
          DockLocation.CENTER,
          -1,
        ),
      )
    }
  }, [model])

  // 使用新的 factory 和 renderer
  const factory = createTabFactory()
  const onRenderTab = createTabRenderer()

  const onRenderTabSet = (node: TabSetNode | BorderNode, renderValues: ITabSetRenderValues) => {
    if (node instanceof TabSetNode) {
      const activeTabSet = model.getActiveTabset()

      // 只在活动的 tabset 上添加操作按钮
      if (activeTabSet && activeTabSet.getId() === node.getId()) {
        // 添加新 Chat Tab 按钮
        renderValues.buttons.push(
          <Button
            key={`${node.getId()}-new-chat`}
            variant="ghost"
            size="sm"
            className="size-6 cursor-pointer p-0 hover:bg-border"
            aria-label="New Chat"
            onClick={() => {
              const chatTab = createChatTab({
                title: 'New Chat',
              })
              model.doAction(
                Actions.addNode(
                  {
                    type: 'tab',
                    name: chatTab.title,
                    component: 'generic',
                    config: chatTab,
                  },
                  node.getId(),
                  DockLocation.CENTER,
                  -1,
                ),
              )
            }}
          >
            <BotIcon size={16} aria-hidden="true" />
          </Button>,
        )

        // 添加新 Terminal Tab 按钮
        renderValues.buttons.push(
          <Button
            key={`${node.getId()}-new-terminal`}
            variant="ghost"
            size="sm"
            className="size-6 cursor-pointer p-0 hover:bg-border"
            aria-label="New Terminal"
            onClick={() => {
              const terminalTab = createTerminalTab({})
              model.doAction(
                Actions.addNode(
                  {
                    type: 'tab',
                    name: terminalTab.title,
                    component: 'generic',
                    config: terminalTab,
                  },
                  node.getId(),
                  DockLocation.CENTER,
                  -1,
                ),
              )
            }}
          >
            <PlusIcon size={16} aria-hidden="true" />
          </Button>,
        )

        // 分屏按钮
        renderValues.buttons.push(
          <Button
            key={`${node.getId()}-split`}
            variant="ghost"
            size="sm"
            className="size-6 cursor-pointer p-0 hover:bg-border"
            aria-label="Split editor"
            onClick={() => {
              const activeTabSet = model.getActiveTabset()
              if (activeTabSet && activeTabSet.getSelected() !== -1) {
                const selectedTab = activeTabSet.getChildren()[activeTabSet.getSelected()] as TabNode
                const tabConfig = selectedTab.getConfig()

                model.doAction(
                  Actions.addNode(
                    {
                      type: 'tab',
                      name: tabConfig.title,
                      component: 'generic',
                      config: tabConfig,
                    },
                    activeTabSet.getId(),
                    DockLocation.RIGHT,
                    -1,
                    true,
                  ),
                )
              }
            }}
          >
            <Columns2Icon size={16} aria-hidden="true" />
          </Button>,
        )
      }

      // 所有 tabset 都添加更多选项按钮
      renderValues.buttons.push(
        <Button
          key={`${node.getId()}-more`}
          variant="ghost"
          size="sm"
          className="size-6 cursor-pointer p-0 hover:bg-border"
          aria-label="More"
        >
          <MoreHorizontalIcon size={16} aria-hidden="true" />
        </Button>,
      )
    }
  }

  return (
    <div className="h-screen">
      <div className="relative size-full">
        <Layout
          model={model}
          factory={factory}
          onRenderTab={onRenderTab}
          onRenderTabSet={onRenderTabSet}
          realtimeResize={true}
          icons={{
            close: () => <XIcon size={16} />,
          }}
        />
      </div>
    </div>
  )
}
