import type { IJsonModel } from '@massbug/flexlayout-react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { defaultLayoutConfig } from '@/constants/flexlayout'

interface WorkspaceFlexLayoutState {
  jsonModel: IJsonModel
  realtimeResize: boolean
}

interface WorkspaceFlexLayoutActions {
  setJsonModel: (jsonModel: IJsonModel) => void
  setRealtimeResize: (realtimeResize: boolean) => void
}

export const useWorkspaceFlexLayoutStore = create<
  WorkspaceFlexLayoutState & WorkspaceFlexLayoutActions
>()(
  persist(
    set => ({
      jsonModel: defaultLayoutConfig,
      realtimeResize: true,
      setJsonModel: (jsonModel: IJsonModel) => set({ jsonModel }),
      setRealtimeResize: (realtimeResize: boolean) => set({ realtimeResize }),
    }),
    {
      name: 'workspace-flexlayout-storage',
      storage: createJSONStorage(() => localStorage),
      version: 0,
      partialize: state => ({
        jsonModel: state.jsonModel,
        realtimeResize: state.realtimeResize,
      }),
    },
  ),
)
