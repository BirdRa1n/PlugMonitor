import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

const handler = {
  // Envia mensagens genéricas pelo IPC
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value);
  },
  // Escuta mensagens do processo principal
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args);
    ipcRenderer.on(channel, subscription);
    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
  // Funções específicas para portas seriais
  listSerialPorts: async () => {
    return ipcRenderer.invoke('list-serial-ports');
  },
  connectSerialPort: async (portPath: string, options: any) => {
    return ipcRenderer.invoke('connect-serial-port', portPath, options);
  },
  disconnectSerialPort: async () => {
    return ipcRenderer.invoke('disconnect-serial-port');
  },
  readSerialPort: async () => {
    return ipcRenderer.invoke('read-serial-port');
  },
  sendSerialData: async (data: string) => {
    return ipcRenderer.invoke('send-serial-data', data);
  },
  onSerialData: (callback: (data: string) => void) => {
    const subscription = (_event: IpcRendererEvent, data: string) => callback(data);
    ipcRenderer.on('serial-data-received', subscription);
    return () => {
      ipcRenderer.removeListener('serial-data-received', subscription);
    };
  },
};

contextBridge.exposeInMainWorld('ipc', handler);

export type IpcHandler = typeof handler;