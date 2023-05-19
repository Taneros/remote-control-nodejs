import { WebSocketServer } from 'ws';
import http from 'http';

// Create a server instance
const server = http.createServer();

// Create a WebSocket server
const wss = new WebSocketServer({ server });

// WebSocket server event listeners
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  // Handle messages received from clients
  ws.on('message', (message) => {
    console.log('Received message:', message);

    // Send a response back to the client
    ws.send('Hello client!');
  });

  // Handle connection close
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Start the server
server.listen(8080, () => {
  console.log('WebSocket server is listening on port 8181');
});
