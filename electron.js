import { app, BrowserWindow } from 'electron';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    title: "Sanopalz Server Panel",
    autoHideMenuBar: true,
  });

  // Wait a bit for the express server to start up
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000');
  }, 2000);
}

app.whenReady().then(() => {
  // Start the backend Express server
  serverProcess = spawn('node', [path.join(__dirname, 'dist', 'server.cjs')], { stdio: 'inherit' });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (serverProcess) {
      serverProcess.kill();
    }
    app.quit();
  }
});
