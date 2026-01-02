import type { InferUITools, ToolSet, UIDataTypes, UIMessage } from 'ai'
import { tool } from 'ai'
import z from 'zod'

export const messageMetadataSchema = z.object({
  createdAt: z.number(),
})

export type MessageMetadata = z.infer<typeof messageMetadataSchema>

const serverTools = {
  getTemperature: tool({
    description: 'Get the current temperature for a location (fahrenheit)',
    inputSchema: z.object({
      location: z.string().describe('The location to get the weather for'),
    }),
    execute: async ({ location }) => {
      const temperature = Math.round(Math.random() * (90 - 32) + 32)
      return {
        location,
        temperature,
      }
    },
  }),
  convertToCelsius: tool({
    description: 'Convert a temperature from fahrenheit to celsius',
    inputSchema: z.object({
      temperature: z
        .number()
        .describe('The temperature in fahrenheit to convert'),
    }),
    execute: async ({ temperature }) => {
      const celsius = Math.round((temperature - 32) * (5 / 9))
      return {
        celsius,
      }
    },
  }),
}

const clientTools = {
  getTheme: tool({
    description: 'Get the current application theme setting',
    inputSchema: z.object({}),
    outputSchema: z.object({
      theme: z.enum(['system', 'light', 'dark']),
    }),
  }),
  setTheme: tool({
    description: 'Set the application theme to system, light, or dark mode',
    inputSchema: z.object({
      theme: z.enum(['system', 'light', 'dark']),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string().optional(),
    }),
  }),
}

export const tools = {
  ...serverTools,
  ...clientTools,
} satisfies ToolSet

export type MyTools = InferUITools<typeof tools>

export type MyMessage = UIMessage<MessageMetadata, UIDataTypes, MyTools>
