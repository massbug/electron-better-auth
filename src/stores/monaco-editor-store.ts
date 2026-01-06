import type { editor } from 'monaco-editor'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface MonacoEditorStore {
  editor: editor.IStandaloneCodeEditor | null
}

interface MonacoEditorActions {
  setEditor: (editor: editor.IStandaloneCodeEditor) => void
}

export const useMonacoEditorStore = create<
  MonacoEditorStore & MonacoEditorActions
>()(
  persist(
    set => ({
      editor: null,
      setEditor: editor => set({ editor }),
    }),
    {
      name: 'monaco-editor',
      version: 0,
      storage: createJSONStorage(() => localStorage),
      partialize: () => ({}),
    },
  ),
)
