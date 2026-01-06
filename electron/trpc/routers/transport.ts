import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { convertToModelMessages, stepCountIs, streamText } from 'ai'
import z from 'zod'
import { monacoTools } from '../../ai/tools/monaco/definitions'
import { baseProcedure, createTRPCRouter } from '../init'

export const transportRouter = createTRPCRouter({
  chat: baseProcedure.input(z.object({
    modelId: z.string(),
    messages: z.array(z.any()),
  })).subscription(async function* ({ input, signal }) {
    const otterflow = createOpenAICompatible({
      name: 'otterflow',
      baseURL: 'http://localhost:3000/v1',
    })

    const result = streamText({
      model: otterflow(input.modelId),
      messages: await convertToModelMessages(input.messages),
      abortSignal: signal,
      stopWhen: stepCountIs(1000),
      toolChoice: 'auto',
      tools: monacoTools,
    })

    const stream = result.toUIMessageStream({
      originalMessages: input.messages,
      messageMetadata: ({ part }) => {
        if (part.type === 'start') {
          return {
            createdAt: Date.now(),
          }
        }
      },
      onError: (error) => {
        // Note: By default, the AI SDK will return "An error occurred",
        // which is intentionally vague in case the error contains sensitive information like API keys.
        // If you want to provide more detailed error messages, keep the code below. Otherwise, remove this whole onError callback.
        if (error == null) {
          return 'Unknown error'
        }
        if (typeof error === 'string') {
          return error
        }
        if (error instanceof Error) {
          return error.message
        }
        return JSON.stringify(error)
      },
    })

    const reader = stream.getReader()

    while (true) {
      const { done, value } = await reader.read()
      if (done)
        break
      yield value
    }
  }),
})
