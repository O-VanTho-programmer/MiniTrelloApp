import {io} from 'socket.io-client';

const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const customPort = urlParams?.get('port');

const serverUrl = customPort 
    ? `http://localhost:${customPort}` 
    : (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000');

export const socket = io(serverUrl, {
  autoConnect: false 
});

console.log(`🔌 Socket configured to connect to: ${serverUrl}`);