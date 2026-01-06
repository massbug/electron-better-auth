'use client'

import type { BorderNode, IJsonModel, ITabRenderValues, ITabSetRenderValues, TabNode } from '@massbug/flexlayout-react'
import type { LucideIcon } from 'lucide-react'
import {
  Actions,
  Layout,
  Model,
  TabSetNode,
} from '@massbug/flexlayout-react'
import { MaximizeIcon, MinimizeIcon } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import '@/styles/flexlayout.css'

interface FlexLayoutProps {
  icons: Record<string, LucideIcon>
  components: Record<string, React.ReactNode>
  jsonModel: IJsonModel
  setJsonModel: (jsonModel: IJsonModel) => void
  realtimeResize?: boolean
}

export function FlexLayout({
  icons,
  components,
  jsonModel,
  setJsonModel,
  realtimeResize = true,
}: FlexLayoutProps) {
  const model = useMemo(() => Model.fromJson(jsonModel), [jsonModel])

  const factory = useCallback(
    (node: TabNode) => {
      const component = node.getComponent()
      if (!component) {
        return null
      }
      return components[component]
    },
    [components],
  )

  const onRenderTab = useCallback(
    (node: TabNode, renderValues: ITabRenderValues) => {
      const Icon = icons[node.getId()]

      renderValues.content = (
        <div className="flex items-center gap-1">
          <div className={`
            flex h-5 w-5 items-center justify-center text-green-500
          `}
          >
            {Icon && (
              <Icon className="opacity-60" size={16} aria-hidden="true" />
            )}
          </div>
          <span className="text-sm font-medium whitespace-nowrap">
            {node.getName()}
          </span>
        </div>
      )
    },
    [icons],
  )

  const onModelChange = useCallback(
    (model: Model) => {
      setJsonModel(model.toJson())
    },
    [setJsonModel],
  )

  const onRenderTabSet = useCallback(
    (
      tabSetNode: TabSetNode | BorderNode,
      renderValues: ITabSetRenderValues,
    ) => {
      if (tabSetNode instanceof TabSetNode) {
        if (tabSetNode.canMaximize()) {
          renderValues.buttons.push(
            <Button
              key={`${tabSetNode.getId()}`}
              variant="ghost"
              size="sm"
              className={`
                h-6 w-6 cursor-pointer p-0
                hover:bg-border
                dark:hover:bg-border
              `}
              aria-label="Maximize tabset"
              onClick={() => {
                model.doAction(Actions.maximizeToggle(tabSetNode.getId()))
              }}
            >
              {tabSetNode.isMaximized()
                ? (
                    <MinimizeIcon size={16} aria-hidden="true" />
                  )
                : (
                    <MaximizeIcon size={16} aria-hidden="true" />
                  )}
            </Button>,
          )
        }
      }
    },
    [model],
  )

  return (
    <Layout
      model={model}
      factory={factory}
      onRenderTab={onRenderTab}
      onRenderTabSet={onRenderTabSet}
      realtimeResize={realtimeResize}
      onModelChange={onModelChange}
    />
  )
}
