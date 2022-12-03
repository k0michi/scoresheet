import { ipcRenderer, contextBridge } from 'electron';

export class Bridge {
  readFile = (filePath: string): Promise<string> => ipcRenderer.invoke('read-file', filePath);
  writeFile = (filePath: string, data: string): Promise<string> => ipcRenderer.invoke('write-file', filePath, data);
  saveDialog = (): Promise<string | undefined> => ipcRenderer.invoke('save-dialog');
  now = (): Promise<bigint> => ipcRenderer.invoke('now');
}

contextBridge.exposeInMainWorld('bridge', new Bridge());