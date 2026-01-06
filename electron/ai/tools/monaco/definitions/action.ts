import { tool } from 'ai'
import z from 'zod'

export const actionTools = {
  getFullRange: tool({
    description:
      'Get the full range of the editor content. Use this to get the range for replacing the entire document.',
    inputSchema: z.object({}),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string().optional(),
      data: z
        .object({
          range: z.object({
            startLineNumber: z.number(),
            startColumn: z.number(),
            endLineNumber: z.number(),
            endColumn: z.number(),
          }),
        })
        .optional(),
    }),
  }),

  findAndReplace: tool({
    description: `Find text and replace it with new text. This is the PREFERRED tool for simple text replacements.
    
Use this tool when:
- Replacing specific text with new text
- The replacement is straightforward text substitution
- You want to replace one or all occurrences

For complex multi-point edits or insertions at specific positions, use executeEdits instead.`,
    inputSchema: z.object({
      searchString: z.string().describe('The exact text to find'),
      replaceString: z.string().describe('The text to replace with'),
      replaceAll: z
        .boolean()
        .optional()
        .default(false)
        .describe(
          'Replace all occurrences (default: false, only replaces first)',
        ),
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
          replacedCount: z.number().describe('Number of replacements made'),
        })
        .optional(),
    }),
  }),

  executeEdits: tool({
    description: `Apply text edits to the editor with precise control over positions.
    
Use this tool when:
- Making multiple different edits at once
- Inserting text at specific positions (not replacing)
- Need precise column-level control
- findAndReplace is not suitable for the task

For simple text replacements, prefer using findAndReplace instead as it's less error-prone.

CRITICAL RULES for range calculation:
1. Columns are 1-indexed (first character is column 1)
2. endColumn is EXCLUSIVE (the character at endColumn is NOT included in the range)
3. To replace an entire line: startColumn=1, endColumn=(line length + 1)
4. To replace part of a line: carefully calculate startColumn and endColumn to include exactly the text you want to replace

BEST PRACTICE: Use getLineContent tool first to get the exact line content and length before calculating the range.

Examples:
- Line content: "    map.set(nums[i], i);" (length = 27)
  To replace entire line: {startLineNumber: 9, startColumn: 1, endLineNumber: 9, endColumn: 28}
  To replace just "nums[i]": find the position first, e.g., {startLineNumber: 9, startColumn: 13, endLineNumber: 9, endColumn: 20}

To insert text at a position, use an empty range (startColumn === endColumn).
To delete text, use an empty string as replacement text.`,
    inputSchema: z.object({
      edits: z.array(
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
    }),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string().optional(),
      data: z.string().optional(),
    }),
  }),
}
