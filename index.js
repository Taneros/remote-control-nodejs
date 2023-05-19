import WebSocket, { WebSocketServer } from 'ws';
import { httpServer } from "./src/http_server/index.js";
import { mouse, left, right, up, down } from "@nut-tree/nut-js";

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);

const wss = new WebSocketServer( {server: httpServer} )

wss.on('connection', function connection(ws) {
  ws.on( 'message', function incoming ( data ) {
      


    (async () => {
      await mouse.move(left(500));
      await mouse.move(up(500));
      await mouse.move(right(500));
      await mouse.move(down(500))
  })();

        wss.clients.forEach(function each(client) {
            if ( !client !== ws && client.readyState === WebSocket.OPEN ) {
              if ( typeof data === 'string' ) {
                console.log(`index.js - line: 18 ->> client.send TEXT`)
                client.send( data )
              } else if (data instanceof Buffer) {
                console.log(`index.js - line: 21 ->> client.send BUFFER`, )
                const text = data.toString( 'utf8' );
                client.send( text )
              }
            }
        })
    })
} )

httpServer.listen( HTTP_PORT );

// const wz = new WebSocket( 'ws://localhost:8181' )

// wz.onopen = () => {
//   console.log('Connection opened!');
// }

// wz.onmessage = ( {data} ) => {
//   if (typeof data === 'string') {
//     console.log('Received message:', data);
//   } else if (data instanceof Buffer) {
//     const text = data.toString('utf8');
//     console.log('Received binary message:', text);
//   }
// }
// wz.onclose = () => {wz = null}