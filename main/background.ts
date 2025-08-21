import { app, BrowserWindow, ipcMain } from 'electron';
import serve from 'electron-serve';
import os from 'os';
import path from 'path';
import { SerialPort } from 'serialport';
import { createWindow } from './helpers';

const isProd = process.env.NODE_ENV === 'production';
const platform = os.platform();

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

let serialPort: SerialPort | null = null;

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    minWidth: 1000,
    minHeight: 600,
    titleBarStyle: platform === 'darwin' ? 'hidden' : 'default',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    // mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

// Manipulador IPC genérico
ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`);
});

// Listar portas seriais disponíveis
ipcMain.handle('list-serial-ports', async () => {
  try {
    const ports = await SerialPort.list();
    console.log('Portas Seriais Disponíveis:', ports);
    return ports
      .filter(port => port.productId)
      .map((port) => ({
        path: port.path,
        manufacturer: port.manufacturer,
        serialNumber: port.serialNumber,
      }));
  } catch (error) {
    console.error('Erro ao listar portas seriais:', error);
    return [];
  }
});

// Conectar a uma porta serial
ipcMain.handle('connect-serial-port', async (_event, portPath: string, options: any) => {
  try {
    if (serialPort) {
      await serialPort.close();
    }
    serialPort = new SerialPort({ path: portPath, ...options });

    // Escutar dados recebidos da porta serial
    serialPort.on('data', (data) => {
      BrowserWindow.getAllWindows()[0].webContents.send('serial-data-received', data.toString());
    });

    return { success: true, message: `Conectado à porta ${portPath}` };
  } catch (error) {
    console.error('Erro ao conectar à porta serial:', error);
    return { success: false, message: `Falha ao conectar à porta ${portPath}` };
  }
});

// Desconectar da porta serial
ipcMain.handle('disconnect-serial-port', async () => {
  try {
    if (serialPort && serialPort.isOpen) {
      await serialPort.close();
      serialPort = null;
      return { success: true, message: 'Porta serial desconectada' };
    }
    return { success: false, message: 'Nenhuma porta serial conectada' };
  } catch (error) {
    console.error('Erro ao desconectar da porta serial:', error);
    return { success: false, message: 'Erro ao desconectar' };
  }
});

// Ler dados da porta serial
ipcMain.handle('read-serial-port', async () => {
  if (!serialPort || !serialPort.isOpen) {
    return { success: false, message: 'Nenhuma porta serial conectada' };
  }
  return new Promise((resolve) => {
    serialPort.once('data', (data) => {
      resolve({ success: true, data: data.toString() });
    });
  });
});

// Enviar dados para a porta serial
ipcMain.handle('send-serial-data', async (_event, data: string) => {
  if (!serialPort || !serialPort.isOpen) {
    return { success: false, message: 'Nenhuma porta serial conectada' };
  }
  try {
    serialPort.write(data);
    return { success: true, message: 'Dados enviados com sucesso' };
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
    return { success: false, message: 'Erro ao enviar dados' };
  }
});