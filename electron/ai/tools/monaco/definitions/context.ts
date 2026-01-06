import { tool } from 'ai'
import z from 'zod'

export const contextTools = {
  hasSelection: tool({
    description:
      'Check if the user has any text selected in the editor. Use this to determine whether to call getSelection.',
    inputSchema: z.object({}),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string().optional(),
      data: z
        .object({
          hasSelection: z.boolean(),
        })
        .optional(),
    }),
  }),
  getSelection: tool({
    description:
      'Get the text and range of the current selection in the editor. Returns the selected text value along with position information (start/end line and column numbers). Use this when the user asks about or wants to modify their selected code.',
    inputSchema: z.object({}),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string().optional(),
      data: z
        .object({
          selection: z.object({
            startLineNumber: z.number(),
            startColumn: z.number(),
            endLineNumber: z.number(),
            endColumn: z.number(),
            selectionStartLineNumber: z.number(),
            selectionStartColumn: z.number(),
            positionLineNumber: z.number(),
            positionColumn: z.number(),
          }),
          text: z.string(),
        })
        .optional(),
    }),
  }),
  getCursorPosition: tool({
    description:
      'Get the current cursor position (line and column) in the editor. Use this when you need to know where the user\'s cursor is located.',
    inputSchema: z.object({}),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string().optional(),
      data: z
        .object({
          position: z.object({
            lineNumber: z.number(),
            column: z.number(),
          }),
        })
        .optional(),
    }),
  }),
  getEditorContent: tool({
    description:
      'Get all content in the editor. Use this when you need to see the entire file, not just the selected portion.',
    inputSchema: z.object({}),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string().optional(),
      data: z.string().optional(),
    }),
  }),
  getLineContent: tool({
    description:
      'Get the content of a specific line in the editor. Returns the line text and its length, which is essential for calculating correct column positions when making edits.',
    inputSchema: z.object({
      lineNumber: z.number().describe('The line number to get (1-indexed)'),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string().optional(),
      data: z
        .object({
          lineNumber: z.number(),
          content: z.string(),
          length: z.number().describe('The length of the line content'),
        })
        .optional(),
    }),
  }),
  getLineCount: tool({
    description:
      'Get the total number of lines in the editor. Useful for validating line numbers before making edits.',
    inputSchema: z.object({}),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string().optional(),
      data: z
        .object({
          lineCount: z.number(),
        })
        .optional(),
    }),
  }),
  getContentInRange: tool({
    description:
      'Get the text content within a specific range. Useful for examining a portion of code before making edits.',
    inputSchema: z.object({
      range: z.object({
        startLineNumber: z.number(),
        startColumn: z.number(),
        endLineNumber: z.number(),
        endColumn: z.number(),
      }),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string().optional(),
      data: z
        .object({
          text: z.string(),
        })
        .optional(),
    }),
  }),
  findText: tool({
    description:
      'Find all occurrences of a text pattern in the editor. Returns the positions where the text was found. Useful for finding and replacing multiple occurrences or locating specific code.',
    inputSchema: z.object({
      searchString: z.string().describe('The text to search for'),
      matchCase: z
        .boolean()
        .optional()
        .default(true)
        .describe('Whether to match case (default: true)'),
      matchWholeWord: z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether to match whole words only (default: false)'),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string().optional(),
      data: z
        .object({
          matches: z.array(
            z.object({
              range: z.object({
                startLineNumber: z.number(),
                startColumn: z.number(),
                endLineNumber: z.number(),
                endColumn: z.number(),
              }),
              text: z.string(),
            }),
          ),
          count: z.number().describe('Total number of matches found'),
        })
        .optional(),
    }),
  }),
}
