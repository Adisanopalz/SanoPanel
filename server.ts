import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { spawn, ChildProcess } from 'child_process';
import os from 'os';
import si from 'systeminformation';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  
  // Setup Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  app.use(cors());
  app.use(express.json());

  // Memory store for servers (in a real app, use SQLite)
  const mcServers: Record<string, {
    id: string;
    name: string;
    status: 'offline' | 'starting' | 'online' | 'stopping';
    process: ChildProcess | null;
    ramMin: number;
    ramMax: number;
    jarPath: string;
  }> = {
    'server-1': {
      id: 'server-1',
      name: 'Survival Server',
      status: 'offline',
      process: null,
      ramMin: 1024,
      ramMax: 2048,
      jarPath: 'server.jar'
    }
  };

  // API Routes
  app.get('/api/servers', (req, res) => {
    const serversList = Object.values(mcServers).map(s => ({
      id: s.id,
      name: s.name,
      status: s.status,
      ramMin: s.ramMin,
      ramMax: s.ramMax,
      jarPath: s.jarPath
    }));
    res.json(serversList);
  });

  app.post('/api/servers/:id/start', (req, res) => {
    const serverId = req.params.id;
    const server = mcServers[serverId];
    if (!server) return res.status(404).json({ error: 'Server not found' });
    if (server.status !== 'offline') return res.status(400).json({ error: 'Server is already running or starting' });

    server.status = 'starting';
    io.emit('serverStatus', { id: server.id, status: server.status });

    // Note: In AI Studio, we won't actually be able to run a real MC server easily.
    // For demonstration, we will spawn a fake process that just outputs text if jar is missing, 
    // or try to run 'java' if available. 
    // We'll simulate a server starting for the sake of the panel UI.
    
    // We try to run actual Java MC Server if this is run locally
    let mcArgs = [`-Xms${server.ramMin}M`, `-Xmx${server.ramMax}M`, '-jar', server.jarPath, 'nogui'];
    let fakeArgs = [os.platform() === 'win32' ? '/c' : '-c', 'echo Starting Minecraft server using local java... && java -version && echo Done! (Simulated Mode)'];
    
    // We will just use the java command. If it fails, that means we are in the web container.
    const mcProcess = spawn('java', mcArgs, { cwd: path.join(__dirname) });

    server.process = mcProcess;
    
    mcProcess.on('error', (err) => {
      // Fallback for AI Studio container without Java
      io.emit('console', { id: server.id, data: `Error starting real Java process: ${err.message}. Falling back to simulation...` });
      
      const fakeProcess = spawn(os.platform() === 'win32' ? 'cmd' : 'sh', fakeArgs);
      server.process = fakeProcess;
      
      fakeProcess.stdout?.on('data', d => {
        io.emit('console', { id: server.id, data: d.toString() });
        if (d.toString().includes('Done')) {
          server.status = 'online';
          io.emit('serverStatus', { id: server.id, status: server.status });
        }
      });
      
      fakeProcess.on('close', code => {
        server.status = 'offline';
        server.process = null;
        io.emit('serverStatus', { id: server.id, status: server.status });
      });
    });

    if (mcProcess.stdout) {
      mcProcess.stdout.on('data', (data) => {
        io.emit('console', { id: server.id, data: data.toString() });
        if (data.toString().includes('Done') || data.toString().includes('help')) {
          server.status = 'online';
          io.emit('serverStatus', { id: server.id, status: server.status });
        }
      });
    }

    if (mcProcess.stderr) {
      mcProcess.stderr.on('data', (data) => {
        io.emit('console', { id: server.id, data: data.toString() });
      });
    }

    mcProcess.on('close', (code) => {
      io.emit('console', { id: server.id, data: `\nProcess exited with code ${code}\n` });
      server.status = 'offline';
      server.process = null;
      io.emit('serverStatus', { id: server.id, status: server.status });
    });

    res.json({ success: true, message: 'Server starting' });
  });

  app.post('/api/servers/:id/stop', (req, res) => {
    const serverId = req.params.id;
    const server = mcServers[serverId];
    if (!server) return res.status(404).json({ error: 'Server not found' });
    if (server.status === 'offline') return res.status(400).json({ error: 'Server is already offline' });

    server.status = 'stopping';
    io.emit('serverStatus', { id: server.id, status: server.status });

    if (server.process) {
      // If we had a real MC process, we'd write to stdin:
      // server.process.stdin.write('stop\n');
      
      // For the mock process, we just kill it
      server.process.kill();
    } else {
      server.status = 'offline';
      io.emit('serverStatus', { id: server.id, status: server.status });
    }

    res.json({ success: true, message: 'Server stopping' });
  });

  app.post('/api/servers/:id/command', (req, res) => {
    const serverId = req.params.id;
    const { command } = req.body;
    const server = mcServers[serverId];
    if (!server || !server.process || !command) return res.status(400).json({ error: 'Bad request' });
    
    // server.process.stdin.write(command + '\n');
    io.emit('console', { id: server.id, data: `> ${command}\n` });
    io.emit('console', { id: server.id, data: `Unknown command or simulated environment.\n` });
    
    res.json({ success: true });
  });

  // System stats API
  app.get('/api/system', async (req, res) => {
    try {
      const mem = await si.mem();
      const cpu = await si.currentLoad();
      res.json({
        cpu: cpu.currentLoad,
        memUsed: mem.active,
        memTotal: mem.total
      });
    } catch (e) {
      res.status(500).json({ error: 'Failed to get stats' });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Sanopalz Server Panel running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
