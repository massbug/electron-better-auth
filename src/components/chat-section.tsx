import type { MyMessage } from 'electron/tools'
import { lastAssistantMessageIsCompleteWithToolCalls } from 'ai'
import { useState } from 'react'
import { useChat } from '@/lib/use-electron-chat'
import { useTheme } from './theme-provider'

export default function Chat() {
  const modelId = 'DeepSeek-V3.2'
  const [input, setInput] = useState('')
  const { theme, setTheme } = useTheme()

  const { messages, sendMessage, addToolOutput } = useChat<MyMessage>(modelId, {
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall: ({ toolCall }) => {
      if (toolCall.dynamic) {
        return
      }
      switch (toolCall.toolName) {
        case 'getTheme': {
          addToolOutput({
            tool: 'getTheme',
            toolCallId: toolCall.toolCallId,
            output: { theme },
          })
          break
        }
        case 'setTheme': {
          setTheme(toolCall.input.theme)
          addToolOutput({
            tool: 'setTheme',
            toolCallId: toolCall.toolCallId,
            output: { success: true, message: `Theme set to ${toolCall.input.theme}` },
          })
          break
        }
      }
    },
  })

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <div key={`${message.id}-${i}`}>{part.text}</div>
              default:
                return null
            }
          })}
        </div>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          sendMessage({ text: input })
          setInput('')
        }}
      >
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  )
}
