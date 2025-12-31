import type { UIMessage, UseChatOptions } from '@ai-sdk/react'
import type { ChatInit } from 'ai'
import {
  useChat as useChatSDK,
} from '@ai-sdk/react'
import { useEffect, useMemo, useRef } from 'react'
import { ElectronChatTransport } from './electron-chat-transport'

type ElectronChatOptions<TMessage extends UIMessage = UIMessage> = Omit<ChatInit<TMessage>, 'transport'>
  & Pick<UseChatOptions<TMessage>, 'experimental_throttle' | 'resume'>

// This is a wrapper around the AI SDK's useChat hook
// It implements model switching and uses the electron chat transport,
// making a nice reusable hook for chat functionality.
export function useChat<TMessage extends UIMessage = UIMessage>(modelId: string, options?: ElectronChatOptions<TMessage>) {
  const transportRef = useRef<ElectronChatTransport | null>(null)

  // Create transport using useMemo to avoid recreating on every render
  const transport = useMemo(() => {
    return new ElectronChatTransport(modelId)
  }, [modelId])

  // Store the transport in ref for model updates
  useEffect(() => {
    transportRef.current = transport
  }, [transport])

  useEffect(() => {
    if (transportRef.current) {
      transportRef.current.updateModelId(modelId)
    }
  }, [modelId])

  const chatResult = useChatSDK({
    transport,
    ...options,
  })

  return chatResult
}
