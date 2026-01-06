import type { InferUITools, ToolSet, UIDataTypes, UIMessage } from 'ai'
import z from 'zod'
import { actionTools } from './action'
import { contextTools } from './context'

export const messageMetadataSchema = z.object({
  createdAt: z.number(),
})

export type MessageMetadata = z.infer<typeof messageMetadataSchema>

export const monacoTools = {
  ...contextTools,
  ...actionTools,
} satisfies ToolSet

export type MonacoTools = InferUITools<typeof monacoTools>

export type MonacoMessage = UIMessage<MessageMetadata, UIDataTypes, MonacoTools>
