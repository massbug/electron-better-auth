import type { StoredNode, Workspace } from './types'
import { createCollection, localStorageCollectionOptions } from '@tanstack/react-db'

// ============ Collection 定义 ============
export const workspaceCollection = createCollection(
  localStorageCollectionOptions<Workspace>({
    id: 'workspaces',
    storageKey: 'app-workspaces',
    getKey: item => item.id,
  }),
)

export const fileTreeCollection = createCollection(
  localStorageCollectionOptions<StoredNode>({
    id: 'file-tree',
    storageKey: 'app-file-tree',
    getKey: item => item.id,
  }),
)
