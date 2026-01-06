import type { IJsonModel } from '@massbug/flexlayout-react'

export const defaultLayoutConfig: IJsonModel = {
  global: { tabSetMinWidth: 36, tabSetMinHeight: 36, tabEnableRename: false },
  borders: [],
  layout: {
    type: 'row',
    weight: 100,
    children: [],
  },
}
