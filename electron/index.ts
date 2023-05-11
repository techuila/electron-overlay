// Native
import { join } from 'path';
import Overlay from 'electron-overlay';

// Packages
import { BrowserWindow, app, globalShortcut, ipcMain, screen } from 'electron';
import isDev from 'electron-is-dev';

import Settings from '../libs/Settings';

let mainWindow: BrowserWindow;
let isOverlay = false;

const height = 1080;
const width = 1920;

let scaleFactor = 1.0;
const overlay = Overlay;

const settings = Settings.getInstance();

function addOverlayWindow(
  name: string,
  window: Electron.BrowserWindow,
  dragborder = 0,
  captionHeight = 0,
  transparent = false
) {
  const display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());

  overlay.addWindow(window.id, {
    name,
    transparent,
    resizable: window.isResizable(),
    maxWidth: window.isResizable() ? display.bounds.width : window.getBounds().width,
    maxHeight: window.isResizable() ? display.bounds.height : window.getBounds().height,
    minWidth: window.isResizable() ? 100 : window.getBounds().width,
    minHeight: window.isResizable() ? 100 : window.getBounds().height,
    nativeHandle: window.getNativeWindowHandle().readUInt32LE(0),
    rect: {
      x: window.getBounds().x,
      y: window.getBounds().y,
      width: Math.floor(window.getBounds().width * scaleFactor),
      height: Math.floor(window.getBounds().height * scaleFactor)
    },
    caption: {
      left: dragborder,
      right: dragborder,
      top: dragborder,
      height: captionHeight
    },
    dragBorderWidth: dragborder
  });

  window.webContents.on('paint', (_, __, image: Electron.NativeImage) => {
    overlay.sendFrameBuffer(window.id, image.getBitmap(), image.getSize().width, image.getSize().height);
  });

  window.on('ready-to-show', () => {
    window.focusOnWebView();
  });

  window.on('resize', () => {
    console.log(`${name} resizing`);
    overlay.sendWindowBounds(window.id, {
      rect: {
        x: window.getBounds().x,
        y: window.getBounds().y,
        width: Math.floor(window.getBounds().width * scaleFactor),
        height: Math.floor(window.getBounds().height * scaleFactor)
      }
    });
  });

  // window.on("move", () => {
  //   this.Overlay!.sendWindowBounds(window.id, {
  //     rect: {
  //       x: window.getBounds().x,
  //       y: window.getBounds().y,
  //       width: Math.floor(window.getBounds().width * this.scaleFactor),
  //       height: Math.floor(window.getBounds().height * this.scaleFactor),
  //     },
  //   });
  // });

  const windowId = window.id;
  window.on('closed', () => {
    overlay.closeWindow(windowId);
  });

  window.webContents.on('cursor-changed', (_, type) => {
    let cursor;
    switch (type) {
      case 'default':
        cursor = 'IDC_ARROW';
        break;
      case 'pointer':
        cursor = 'IDC_HAND';
        break;
      case 'crosshair':
        cursor = 'IDC_CROSS';
        break;
      case 'text':
        cursor = 'IDC_IBEAM';
        break;
      case 'wait':
        cursor = 'IDC_WAIT';
        break;
      case 'help':
        cursor = 'IDC_HELP';
        break;
      case 'move':
        cursor = 'IDC_SIZEALL';
        break;
      case 'nwse-resize':
        cursor = 'IDC_SIZENWSE';
        break;
      case 'nesw-resize':
        cursor = 'IDC_SIZENESW';
        break;
      case 'ns-resize':
        cursor = 'IDC_SIZENS';
        break;
      case 'ew-resize':
        cursor = 'IDC_SIZEWE';
        break;
      case 'none':
        cursor = '';
        break;
    }
    if (cursor) {
      overlay.sendCommand({ command: 'cursor', cursor });
    }
  });
}

function startOverlay() {
  overlay.start();
  overlay.setHotkeys([
    {
      name: 'overlay.hotkey.toggleInputIntercept',
      keyCode: 88, //x
      modifiers: { ctrl: true }
    }
  ]);
  overlay.setEventCallback((event: string, payload: any) => {
    if (event === 'game.input') {
      const window = BrowserWindow.fromId(payload.windowId);
      if (window) {
        const inputEvent = overlay.translateInputEvent(payload);
        // if (payload.msg !== 512) {
        //   console.log(event, payload);
        //   console.log(`translate ${JSON.stringify(inputEvent)}`);
        // }

        if (inputEvent) {
          if ('x' in inputEvent) inputEvent['x'] = Math.round(inputEvent['x'] / scaleFactor);
          if ('y' in inputEvent) inputEvent['y'] = Math.round(inputEvent['y'] / scaleFactor);
          window.webContents.sendInputEvent(inputEvent);
        }
      }
    } else if (event === 'game.window.focused') {
      console.log('focusWindowId', payload.focusWindowId);

      BrowserWindow.getAllWindows().forEach((window) => {
        window.blurWebView();
      });

      const focusWin = BrowserWindow.fromId(payload.focusWindowId);
      if (focusWin) {
        focusWin.focusOnWebView();
      }
    }
  });
}

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
  const window = mainWindow;

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

  return window;
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
      show: true
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

ipcMain.once('start', () => {
  const arg = 'Dota 2';
  console.log(`--------------------\n try inject ${arg}`);
  for (const window of overlay.getTopWindows()) {
    if (window.title.indexOf(arg) !== -1) {
      console.log(`--------------------\n injecting ${JSON.stringify(window)}`);
      overlay.injectProcess(window);
    }
  }

  scaleFactor = screen.getDisplayNearestPoint({
    x: 0,
    y: 0
  }).scaleFactor;

  console.log(`starting overlay...`);
  startOverlay();

  const options = {
    x: 1,
    y: 1,
    height: 360,
    width: 640,
    frame: false,
    transparent: true,
    show: false,
    webPreferences: {
      offscreen: true
    }
  };
  const window = createWindow(options);
  window.webContents.on('paint', (_, __, image: Electron.NativeImage) => {
    mainWindow.webContents.send('osrImage', {
      image: image.toDataURL()
    });
  });

  addOverlayWindow('MainOverlay', window, 10, 40);
});

app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-gpu-rasterization');
app.commandLine.appendSwitch('disable-gpu-sandbox');
app.commandLine.appendSwitch('--no-sandbox');
app.disableHardwareAcceleration();
