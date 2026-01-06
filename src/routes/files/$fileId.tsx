import type { FileNode, StoredNode } from '@/lib/file-tree-collection'
import { Editor } from '@monaco-editor/react'
import { createFileRoute } from '@tanstack/react-router'
import { useFile } from '@/hooks/use-file-tree-queries'
import { getMonacoLanguage } from '@/lib/file-tree-collection'
import { useMonacoEditorStore } from '@/stores/monaco-editor-store'

export const Route = createFileRoute('/files/$fileId')({
  component: RouteComponent,
})

function isFileNode(node: StoredNode): node is FileNode {
  return node.type === 'file'
}

function RouteComponent() {
  const { fileId } = Route.useParams()
  const { data: file } = useFile(fileId)
  const { setEditor } = useMonacoEditorStore()
  const fileNode = file && isFileNode(file) ? file : undefined

  if (!fileNode)
    return null

  const language = getMonacoLanguage(fileNode.fileName)

  return (
    <Editor
      theme="vs-dark"
      language={language}
      value={fileNode.content}
      onMount={(editor) => {
        setEditor(editor)
      }}
      options={{
        padding: {
          top: 16,
        },
        minimap: {
          enabled: false,
        },
      }}
    />
  )
}
