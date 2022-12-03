// Modules to control application life and create native browser window

import { app, BrowserWindow, dialog, Event, ipcMain, shell } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import { now } from '@k0michi/now';

const devURL = `http://localhost:5173/`;
let mainWindow: BrowserWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../../renderer/index.html'))
  } else {
    mainWindow.loadURL(devURL)
  }

  function handleNavigate(e: Event, url: string) {
    if (url != devURL) {
      e.preventDefault();
      shell.openExternal(url);
    }
  }

  mainWindow.webContents.on('will-navigate', handleNavigate);
  mainWindow.webContents.on('new-window', handleNavigate);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle('read-file', async (e, filePath: string) => {
  return await fs.readFile(filePath, 'utf-8');
});

ipcMain.handle('write-file', async (e, filePath: string, data: string) => {
  return await fs.writeFile(filePath, data);
});

ipcMain.handle('save-dialog', async (e) => {
  const result = await dialog.showSaveDialog(mainWindow);
  return result.filePath;
});

ipcMain.handle('now', (e) => {
  return now();
});