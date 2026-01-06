import type { MyMessage } from 'electron/tools'
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input'
import { useNavigate } from '@tanstack/react-router'
import { lastAssistantMessageIsCompleteWithToolCalls } from 'ai'
import { CopyIcon, RefreshCcwIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import { Loader } from '@/components/ai-elements/loader'
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message'
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input'
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning'
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources'
import { useChat } from '@/lib/use-electron-chat'
import { useTheme } from './theme-provider'

const models = [
  {
    name: 'DeepSeek V3.2',
    value: 'DeepSeek-V3.2',
  },
  {
    name: 'Qwen3',
    value: 'Qwen3-235B-A22B',
  },
]

interface ChatSectionProps {
  chatId?: string
  initialMessages?: MyMessage[]
  query?: PromptInputMessage
  onCreate?: (query: PromptInputMessage) => void
  onUpdate?: (chatId: string, messages: MyMessage[]) => void
}

export function ChatSection({ chatId, initialMessages, query, onCreate, onUpdate }: ChatSectionProps) {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const { theme, setTheme } = useTheme()
  const [model, setModel] = useState<string>(models[0].value)

  const hasInitializedRef = useRef<boolean>(false)

  const { messages, sendMessage, status, regenerate, addToolOutput } = useChat<MyMessage>(model, {
    id: chatId,
    messages: initialMessages,
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
    onFinish: ({ messages }) => {
      if (chatId) {
        onUpdate?.(chatId, messages)
      }
    },
  })

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text)
    const hasAttachments = Boolean(message.files?.length)
    if (!(hasText || hasAttachments)) {
      return
    }
    setInput('')
    if (!chatId) {
      onCreate?.(message)
    }
    else {
      sendMessage(
        {
          text: message.text || 'Sent with attachments',
          files: message.files,
          metadata: { createdAt: Date.now() },
        },
      )
    }
  }

  useEffect(() => {
    if (query && !hasInitializedRef.current) {
      hasInitializedRef.current = true
      sendMessage({
        text: query.text,
        files: query.files,
      })
      navigate({
        to: '.',
        search: {},
        replace: true,
      })
    }
  }, [navigate, query, sendMessage])

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map(message => (
              <div key={message.id}>
                {message.role === 'assistant' && message.parts.filter(part => part.type === 'source-url').length > 0 && (
                  <Sources>
                    <SourcesTrigger
                      count={
                        message.parts.filter(
                          part => part.type === 'source-url',
                        ).length
                      }
                    />
                    {message.parts.filter(part => part.type === 'source-url').map((part, i) => (
                      <SourcesContent key={`${message.id}-${i}`}>
                        <Source
                          key={`${message.id}-${i}`}
                          href={part.url}
                          title={part.url}
                        />
                      </SourcesContent>
                    ))}
                  </Sources>
                )}
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <Message key={`${message.id}-${i}`} from={message.role}>
                          <MessageContent>
                            <MessageResponse>
                              {part.text}
                            </MessageResponse>
                          </MessageContent>
                          {message.role === 'assistant' && i === messages.length - 1 && (
                            <MessageActions>
                              <MessageAction
                                onClick={() => regenerate()}
                                label="Retry"
                              >
                                <RefreshCcwIcon className="size-3" />
                              </MessageAction>
                              <MessageAction
                                onClick={() =>
                                  navigator.clipboard.writeText(part.text)}
                                label="Copy"
                              >
                                <CopyIcon className="size-3" />
                              </MessageAction>
                            </MessageActions>
                          )}
                        </Message>
                      )
                    case 'reasoning':
                      return (
                        <Reasoning
                          key={`${message.id}-${i}`}
                          className="w-full"
                          isStreaming={status === 'streaming' && i === message.parts.length - 1 && message.id === messages.at(-1)?.id}
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      )
                    default:
                      return null
                  }
                })}
              </div>
            ))}
            {status === 'submitted' && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        <PromptInput onSubmit={handleSubmit} className="mt-4" globalDrop multiple>
          <PromptInputHeader>
            <PromptInputAttachments>
              {attachment => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea
              onChange={e => setInput(e.target.value)}
              value={input}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputSelect
                onValueChange={(value) => {
                  setModel(value)
                }}
                value={model}
              >
                <PromptInputSelectTrigger>
                  <PromptInputSelectValue />
                </PromptInputSelectTrigger>
                <PromptInputSelectContent>
                  {models.map(model => (
                    <PromptInputSelectItem key={model.value} value={model.value}>
                      {model.name}
                    </PromptInputSelectItem>
                  ))}
                </PromptInputSelectContent>
              </PromptInputSelect>
            </PromptInputTools>
            <PromptInputSubmit disabled={!input && !status} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  )
}
