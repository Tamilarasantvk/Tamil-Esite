import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const processes = [
  spawn(process.execPath, ['server.mjs'], { stdio: 'inherit', env: process.env }),
  spawn(process.execPath, [
    fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url)),
    '--port=3000',
    '--host=0.0.0.0'
  ], { stdio: 'inherit', env: process.env })
];

const stopProcesses = () => processes.forEach((child) => {
  if (!child.killed) child.kill('SIGTERM');
});

process.on('SIGINT', () => {
  stopProcesses();
  process.exit(0);
});
process.on('SIGTERM', () => {
  stopProcesses();
  process.exit(0);
});

processes.forEach((child) => child.on('exit', (code) => {
  if (code && code !== 0) {
    stopProcesses();
    process.exit(code);
  }
}));