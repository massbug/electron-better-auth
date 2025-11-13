import path from 'node:path'
// import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { app, BrowserWindow, net, protocol } from 'electron'
import { createIPCHandler } from 'electron-trpc-experimental/main'
import { PROTOCOL } from '../src/constants/protocol'
import { createTRPCContext, protocolUrlEmitter } from './trpc/init'
import { appRouter } from './trpc/routers/_app'

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

protocol.registerSchemesAsPrivileged([
  {
    scheme: PROTOCOL,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
    },
  },
])

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  createIPCHandler({
    router: appRouter,
    windows: [win],
    createContext: async ({ event }) => createTRPCContext({ event }),
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  }
  else {
    // win.loadFile('dist/index.html')
    // win.loadFile(path.join(RENDERER_DIST, 'index.html'))
    win.loadURL(`${PROTOCOL}://index.html`)
  }
}

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [path.resolve(process.argv[1])])
  }
}
else {
  app.setAsDefaultProtocolClient(PROTOCOL)
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
}
else {
  app.on('second-instance', (_event, _commandLine, _workingDirectory) => {
    if (win) {
      if (win.isMinimized())
        win.restore()
      win.focus()
    }
  })

  app.whenReady().then(() => {
    protocol.handle(PROTOCOL, (request) => {
      const { pathname } = new URL(request.url)

      const pathToServe = path.join(RENDERER_DIST, pathname === '/' ? 'index.html' : pathname)
      const relativePath = path.relative(RENDERER_DIST, pathToServe)
      const isSafe = relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath)

      if (!isSafe) {
        return new Response('Bad Request', {
          status: 400,
          headers: { 'content-type': 'text/html' },
        })
      }

      return net.fetch(pathToFileURL(pathToServe).toString())
    })

    createWindow()
  })

  app.on('open-url', (event, url) => {
    event.preventDefault()
    protocolUrlEmitter.emit('protocol-url', url)
  })
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
