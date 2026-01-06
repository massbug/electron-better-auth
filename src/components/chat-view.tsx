import type { MonacoMessage } from 'electron/ai/tools/monaco/definitions'
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input'
import { lastAssistantMessageIsCompleteWithToolCalls } from 'ai'
import { useState } from 'react'
import { useChat } from '@/lib/use-electron-chat'
import { useMonacoEditorStore } from '@/stores/monaco-editor-store'
import { ChatSection } from './chat-section'

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

export function ChatView() {
  const [input, setInput] = useState('')
  const [model, setModel] = useState<string>(models[0].value)

  const { messages, sendMessage, status, stop, regenerate, addToolOutput } = useChat<MonacoMessage>(model, {
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall: ({ toolCall }) => {
      if (toolCall.dynamic) {
        return
      }
      switch (toolCall.toolName) {
        case 'hasSelection': {
          const editor = useMonacoEditorStore.getState().editor
          if (!editor) {
            addToolOutput({
              tool: 'hasSelection',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: 'Editor is not available',
              },
            })
            break
          }
          const selection = editor.getSelection()
          if (selection) {
            addToolOutput({
              tool: 'hasSelection',
              toolCallId: toolCall.toolCallId,
              output: {
                success: true,
                data: {
                  hasSelection: true,
                },
              },
            })
            break
          }
          else {
            addToolOutput({
              tool: 'hasSelection',
              toolCallId: toolCall.toolCallId,
              output: {
                success: true,
                data: {
                  hasSelection: false,
                },
              },
            })
            break
          }
        }
        case 'getSelection': {
          const editor = useMonacoEditorStore.getState().editor
          if (!editor) {
            addToolOutput({
              tool: 'getSelection',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: 'Editor is not available',
              },
            })
            break
          }
          const model = editor.getModel()
          if (!model) {
            addToolOutput({
              tool: 'getSelection',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: 'No editor model found',
              },
            })
            break
          }
          const selection = editor.getSelection()
          if (!selection) {
            addToolOutput({
              tool: 'getSelection',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: 'No text selected',
              },
            })
            break
          }
          const text = model.getValueInRange(selection)
          addToolOutput({
            tool: 'getSelection',
            toolCallId: toolCall.toolCallId,
            output: {
              success: true,
              data: {
                selection,
                text,
              },
            },
          })
          break
        }
        case 'getCursorPosition': {
          const editor = useMonacoEditorStore.getState().editor
          if (!editor) {
            addToolOutput({
              tool: 'getCursorPosition',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: 'Editor is not available',
              },
            })
            break
          }
          const position = editor.getPosition()
          if (!position) {
            addToolOutput({
              tool: 'getCursorPosition',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: 'No cursor position found',
              },
            })
            break
          }
          addToolOutput({
            tool: 'getCursorPosition',
            toolCallId: toolCall.toolCallId,
            output: {
              success: true,
              data: {
                position,
              },
            },
          })
          break
        }
        case 'getEditorContent': {
          const editor = useMonacoEditorStore.getState().editor
          if (!editor) {
            addToolOutput({
              tool: 'getEditorContent',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: 'Editor is not available',
              },
            })
            break
          }
          const value = editor.getValue()
          addToolOutput({
            tool: 'getEditorContent',
            toolCallId: toolCall.toolCallId,
            output: {
              success: true,
              data: value,
            },
          })
          break
        }
        case 'getLineContent': {
          const editor = useMonacoEditorStore.getState().editor
          if (!editor) {
            addToolOutput({
              tool: 'getLineContent',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: 'Editor is not available',
              },
            })
            break
          }

          const model = editor.getModel()
          if (!model) {
            addToolOutput({
              tool: 'getLineContent',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: 'No editor model found',
              },
            })
            break
          }

          const { lineNumber } = toolCall.input
          const lineCount = model.getLineCount()

          if (lineNumber < 1 || lineNumber > lineCount) {
            addToolOutput({
              tool: 'getLineContent',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: `Line number ${lineNumber} is out of range (1-${lineCount})`,
              },
            })
            break
          }

          const content = model.getLineContent(lineNumber)

          addToolOutput({
            tool: 'getLineContent',
            toolCallId: toolCall.toolCallId,
            output: {
              success: true,
              data: {
                lineNumber,
                content,
                length: content.length,
              },
            },
          })
          break
        }
        case 'getLineCount': {
          const editor = useMonacoEditorStore.getState().editor
          if (!editor) {
            addToolOutput({
              tool: 'getLineCount',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: 'Editor is not available',
              },
            })
            break
          }

          const model = editor.getModel()
          if (!model) {
            addToolOutput({
              tool: 'getLineCount',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: 'No editor model found',
              },
            })
            break
          }

          const lineCount = model.getLineCount()

          addToolOutput({
            tool: 'getLineCount',
            toolCallId: toolCall.toolCallId,
            output: {
              success: true,
              data: {
                lineCount,
              },
            },
          })
          break
        }
        case 'getContentInRange': {
          const editor = useMonacoEditorStore.getState().editor
          if (!editor) {
            addToolOutput({
              tool: 'getContentInRange',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: 'Editor is not available',
              },
            })
            break
          }

          const model = editor.getModel()
          if (!model) {
            addToolOutput({
              tool: 'getContentInRange',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: 'No editor model found',
              },
            })
            break
          }

          const { range } = toolCall.input

          // 验证 range 是否有效
          const lineCount = model.getLineCount()
          if (
            range.startLineNumber < 1
            || range.startLineNumber > lineCount
            || range.endLineNumber < 1
            || range.endLineNumber > lineCount
          ) {
            addToolOutput({
              tool: 'getContentInRange',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: `Line numbers out of range (1-${lineCount})`,
              },
            })
            break
          }

          const text = model.getValueInRange(range)
          addToolOutput({
            tool: 'getContentInRange',
            toolCallId: toolCall.toolCallId,
            output: {
              success: true,
              data: {
                text,
              },
            },
          })
          break
        }
        case 'findText': {
          const editor = useMonacoEditorStore.getState().editor
          if (!editor) {
            addToolOutput({
              tool: 'findText',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: 'Editor is not available',
              },
            })
            break
          }

          const model = editor.getModel()
          if (!model) {
            addToolOutput({
              tool: 'findText',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: 'No editor model found',
              },
            })
            break
          }

          const {
            searchString,
            matchCase = true,
            matchWholeWord = false,
          } = toolCall.input

          const matches = model.findMatches(
            searchString,
            true, // searchOnlyEditableRange
            false, // isRegex
            matchCase,
            matchWholeWord ? searchString : null, // wordSeparators
            true, // captureMatches
          )

          const formattedMatches = matches.map(match => ({
            range: {
              startLineNumber: match.range.startLineNumber,
              startColumn: match.range.startColumn,
              endLineNumber: match.range.endLineNumber,
              endColumn: match.range.endColumn,
            },
            text: model.getValueInRange(match.range),
          }))

          addToolOutput({
            tool: 'findText',
            toolCallId: toolCall.toolCallId,
            output: {
              success: true,
              data: {
                matches: formattedMatches,
                count: formattedMatches.length,
              },
            },
          })

          break
        }
        case 'getFullRange': {
          const editor = useMonacoEditorStore.getState().editor
          if (!editor) {
            addToolOutput({
              tool: 'getFullRange',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: 'Editor is not available',
              },
            })
            break
          }
          const model = editor.getModel()
          if (!model) {
            addToolOutput({
              tool: 'getFullRange',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: 'No editor model found',
              },
            })
            break
          }
          const range = model.getFullModelRange()
          addToolOutput({
            tool: 'getFullRange',
            toolCallId: toolCall.toolCallId,
            output: {
              success: true,
              data: {
                range,
              },
            },
          })
          break
        }
        case 'findAndReplace': {
          const editor = useMonacoEditorStore.getState().editor
          if (!editor) {
            addToolOutput({
              tool: 'findAndReplace',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: 'Editor is not available',
              },
            })
            break
          }

          const model = editor.getModel()
          if (!model) {
            addToolOutput({
              tool: 'findAndReplace',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: 'No editor model found',
              },
            })
            break
          }

          const {
            searchString,
            replaceString,
            replaceAll = false,
            matchCase = true,
            matchWholeWord = false,
          } = toolCall.input

          const matches = model.findMatches(
            searchString,
            true, // searchOnlyEditableRange
            false, // isRegex
            matchCase,
            matchWholeWord ? searchString : null, // wordSeparators
            true, // captureMatches
          )

          if (matches.length === 0) {
            addToolOutput({
              tool: 'findAndReplace',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: `No matches found for "${searchString}"`,
              },
            })
            break
          }

          const editsToApply = replaceAll ? matches : [matches[0]]

          const success = editor.executeEdits(
            'ai',
            editsToApply.map(match => ({
              range: match.range,
              text: replaceString,
              forceMoveMarkers: true,
            })),
          )

          addToolOutput({
            tool: 'findAndReplace',
            toolCallId: toolCall.toolCallId,
            output: {
              success,
              data: success
                ? {
                    replacedCount: editsToApply.length,
                  }
                : undefined,
            },
          })
          break
        }
        case 'executeEdits': {
          const editor = useMonacoEditorStore.getState().editor
          if (!editor) {
            addToolOutput({
              tool: 'executeEdits',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: 'Editor is not available',
              },
            })
            break
          }
          const success = editor.executeEdits(
            'ai',
            toolCall.input.edits.map(edit => ({
              ...edit,
              forceMoveMarkers: true,
            })),
          )
          if (success) {
            addToolOutput({
              tool: 'executeEdits',
              toolCallId: toolCall.toolCallId,
              output: {
                success: true,
              },
            })
            break
          }
          else {
            addToolOutput({
              tool: 'executeEdits',
              toolCallId: toolCall.toolCallId,
              output: {
                success: false,
                message: 'Failed to apply edits to the editor',
              },
            })
            break
          }
        }
      }
    },
  })

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text)
    const hasAttachments = Boolean(message.files?.length)
    if (!(hasText || hasAttachments)) {
      return
    }
    sendMessage(
      {
        text: message.text || 'Sent with attachments',
        files: message.files,
        metadata: { createdAt: Date.now() },
      },
    )
    setInput('')
  }

  return (
    <ChatSection
      input={input}
      setInput={setInput}
      messages={messages}
      status={status}
      stop={stop}
      regenerate={regenerate}
      handleSubmit={handleSubmit}
      model={model}
      setModel={setModel}
      models={models}
    />
  )
}
