// Native
import { join } from 'path';

// Packages
import { BrowserWindow, app, globalShortcut, ipcMain } from 'electron';
import isDev from 'electron-is-dev';

import Settings from '../libs/Settings';

let mainWindow: BrowserWindow;
let isOverlay = false;

const height = 1080;
const width = 1920;

const settings = Settings.getInstance();

function createWindow(options: Record<string, any> = {}) {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width,
    height,
    //  change to false to use AppBar
    frame: true,
    show: true,
    transparent: false,
    resizable: true,
    fullscreenable: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    },
    ...options
  });

  const port = process.env.PORT || 3000;
  const url = isDev ? `http://localhost:${port}` : join(__dirname, '../src/out/index.html');

  // and load the index.html of the app.
  if (isDev) {
    mainWindow?.loadURL(url);
  } else {
    mainWindow?.loadFile(url);
  }

  // Open the DevTools.
  // window.webContents.openDevTools();

  // if (event) {
  // Send the overlay state to the renderer process when the window is ready
  // event.sender.send('overlay-state', settings.isOverlay);
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('overlay-state', settings.isOverlay);
  });
  // }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // Register the Alt + Ctrl + o shortcut
  const shortcut_1 = globalShortcut.register('Alt+Ctrl+o', () => {
    console.log('Alt + Ctrl + o is pressed');
    isOverlay = !isOverlay;
    settings.setOverlay(isOverlay);
    const newOptions = {
      frame: !isOverlay,
      transparent: isOverlay,
      alwaysOnTop: isOverlay,
      show: false
    };
    mainWindow.close();
    createWindow(newOptions);

    if (isOverlay) {
      mainWindow.maximize();
    } else {
      mainWindow.setAspectRatio(16 / 9); // Set the aspect ratio of the window
    }
  });

  const shortcut_2 = globalShortcut.register('Alt+Ctrl+s', () => {
    const newOptions = {
      frame: !isOverlay,
      transparent: isOverlay,
      alwaysOnTop: isOverlay,
      show: true
    };
    mainWindow.close();
    createWindow(newOptions);
    mainWindow.setAspectRatio(16 / 9);
  });

  if (!shortcut_1) {
    console.error('Alt + Ctrl + o registration failed');
  }

  if (!shortcut_2) {
    console.error('Alt + Ctrl + s registration failed');
  }

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Unregister the shortcut when the app is quitting
app.on('will-quit', () => {
  globalShortcut.unregister('Alt+Ctrl+o');
  globalShortcut.unregister('Alt+Ctrl+s');
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('set-ignore-mouse-events', (_, ignore, options) => {
  mainWindow.setIgnoreMouseEvents(ignore, options);
});
