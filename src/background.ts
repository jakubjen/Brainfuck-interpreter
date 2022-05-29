import {
  app, protocol, BrowserWindow, Menu, dialog, MenuItem,
} from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import runInterpreterHandler from '@/core/RunTerpreterHandler';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: (!isDevelopment) ? `${process.resourcesPath}/app.asar/icon.png` : 'public/icon.png',
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          click() {
            dialog.showOpenDialog(win, {
              properties: ['openFile'],
              filters: [{
                name: 'Brain fuck file',
                extensions: ['brain', 'txt'],
              }],
            }).then((result) => {
              if (!result.canceled) {
                win.webContents.send('openFile', result);
              }
            }).catch((err) => {
              console.log(err);
            });
          },
          accelerator: 'CmdOrCtrl+O',
        },
        { type: 'separator' },
        {
          label: 'Save',
          click() {
            win.webContents.send('saveFile');
          },
          accelerator: 'CmdOrCtrl+S',
        },
        { type: 'separator' },
        {
          label: 'Save as',
          click() {
            win.webContents.send('saveFileAs');
          },
          accelerator: 'CmdOrCtrl+Shift+S',
        },
        { type: 'separator' },
        {
          label: 'Exit',
          click() {
            app.quit();
          },
          accelerator: 'CmdOrCtrl+Q',
        },
      ],
    },
  ]);

  if (isDevelopment) {
    const devMenu = new MenuItem({
      label: 'Development',
      submenu: [
        {
          label: 'Reload',
          click() {
            win.webContents.reload();
          },
          accelerator: 'CmdOrCtrl+R',
        },
        {
          label: 'Dev tools',
          click() {
            win.webContents.openDevTools();
          },
          accelerator: 'CmdOrCtrl+I',
        },
      ],
    },);

    menu.append(devMenu);
  }
  Menu.setApplicationMenu(menu);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    // if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }
  runInterpreterHandler(win);
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
