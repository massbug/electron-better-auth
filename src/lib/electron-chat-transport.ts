import type { ChatRequestOptions, ChatTransport, UIMessage, UIMessageChunk } from 'ai'
import { trpcClient } from './trpc'

export class ElectronChatTransport implements ChatTransport<UIMessage> {
  private modelId: string

  constructor(modelId: string) {
    this.modelId = modelId
  }

  updateModelId(modelId: string) {
    this.modelId = modelId
  }

  async sendMessages(
    options: {
      chatId: string
      messages: UIMessage[]
      abortSignal: AbortSignal | undefined
    } & {
      trigger: 'submit-message' | 'regenerate-message'
      messageId: string | undefined
    } & ChatRequestOptions,
  ): Promise<ReadableStream<UIMessageChunk>> {
    const modelId = this.modelId

    return new ReadableStream({
      async start(controller) {
        const subscription = trpcClient.transport.chat.subscribe(
          {
            modelId,
            messages: options.messages,
          },
          {
            onData: (chunk) => {
              controller.enqueue(chunk)
            },
            onError: (error) => {
              controller.error(error)
            },
            onComplete: () => {
              controller.close()
            },
          },
        )

        if (options.abortSignal) {
          options.abortSignal.addEventListener('abort', () => {
            subscription.unsubscribe()
            controller.close()
          })
        }
      },
    })
  }

  async reconnectToStream(
    _options: {
      chatId: string
    } & ChatRequestOptions,
  ): Promise<ReadableStream<UIMessageChunk> | null> {
    // This function normally handles reconnecting to a stream on the backend, e.g. /api/chat
    // Since this project has no backend, we can't reconnect to a stream, so this is intentionally no-op.
    return null
  }
}
