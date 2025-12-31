import type { UIMessage, UseChatOptions } from '@ai-sdk/react'
import type { ChatInit } from 'ai'
import {
  useChat as useChatSDK,
} from '@ai-sdk/react'
import { useEffect, useRef } from 'react'
import { ElectronChatTransport } from './electron-chat-transport'

type ElectronChatOptions<TMessage extends UIMessage = UIMessage> = Omit<ChatInit<TMessage>, 'transport'>
  & Pick<UseChatOptions<TMessage>, 'experimental_throttle' | 'resume'>

// This is a wrapper around the AI SDK's useChat hook
// It implements model switching and uses the custom chat transport,
// making a nice reusable hook for chat functionality.
export function useChat<TMessage extends UIMessage = UIMessage>(modelId: string, options?: ElectronChatOptions<TMessage>) {
  const transportRef = useRef<ElectronChatTransport | null>(null) // Using a ref here so we can update the model used in the transport without having to reload the page or recreate the transport

  // eslint-disable-next-line react-hooks/refs
  if (!transportRef.current) {
    transportRef.current = new ElectronChatTransport(modelId)
  }

  useEffect(() => {
    if (transportRef.current) {
      transportRef.current.updateModelId(modelId)
    }
  }, [modelId])

  const chatResult = useChatSDK({
    // eslint-disable-next-line react-hooks/refs
    transport: transportRef.current,
    ...options,
  })

  return chatResult
}
