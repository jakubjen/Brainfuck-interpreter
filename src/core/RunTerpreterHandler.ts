import { Worker } from 'worker_threads';
import { ipcMain, BrowserWindow } from 'electron';
import { resolve as resolvePath } from 'path';

export default async function runInterpreterHandler(window: BrowserWindow) {
  ipcMain.handle('runInterpreter', async (event, code) => {
    const result = await new Promise((resolve, reject) => {
      const worker = new Worker(resolvePath('./src/worker.js'), {
        workerData: code,
      });

      worker.on('message', ({ name, value }) => {
        if (name === 'end') resolve(value);
        if (name === 'userNeedEnterKey') {
          const child = new BrowserWindow({
            parent: window,
            modal: true,
            show: false,
            width: 400,
            height: 200,
            resizable: false,
            closable: false,
            webPreferences: {
              nodeIntegration: true,
            },
          });
          child.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}#/insertChar`);

          child.once('ready-to-show', () => {
            child.setTitle('Enter char');
            child.menuBarVisible = false;
            child.show();
            // child.webContents.openDevTools();
          });

          let charWasSended = false;
          child.once('close', () => {
            if (!charWasSended) {
              worker.postMessage({ name: 'insertChar', value: '0' });
              ipcMain.removeAllListeners('enterKey');
            }
          });
          ipcMain.once('enterKey', (e, char) => {
            worker.postMessage({ name: 'insertChar', value: char });
            charWasSended = true;
            child.close();
          });
        }

        window.webContents.send(name, value);
      });

      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) resolve(`Worker stopped with code ${code}`);
        ipcMain.removeHandler('enterKey');
      });

      ipcMain.once('stopInterpreter', () => {
        try {
          worker.terminate();
        } catch {
          resolve('Interpreter was terminate.');
        }
      });
    });

    return result;
  });
}
