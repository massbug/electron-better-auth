import type { MonacoMessage } from 'electron/ai/tools/monaco/definitions'
import { createCollection, localStorageCollectionOptions } from '@tanstack/react-db'

export interface Chat {
  id: string
  title: string
  messages: MonacoMessage[]
  createdAt: Date
  updatedAt: Date
}

export const chatCollection = createCollection(
  localStorageCollectionOptions<Chat>({
    id: 'chats',
    storageKey: 'app-chats',
    getKey: item => item.id,
  }),
)
