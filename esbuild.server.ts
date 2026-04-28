import { build } from 'esbuild';

build({
  entryPoints: ['server.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/server.cjs',
  format: 'cjs',
  external: ['express', 'socket.io', 'cors', 'sqlite3', 'sqlite', 'systeminformation']
}).catch(() => process.exit(1));
