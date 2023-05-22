import WebSocket, { WebSocketServer } from 'ws';
import { httpServer } from "./http_server/index";
import { mouse, left, right, up, down, straightTo, screen } from "@nut-tree/nut-js";
import { getScreenshot } from './screenshot';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);

const wss = new WebSocketServer({ server: httpServer })

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {

    wss.clients.forEach(async function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        if (typeof data === 'string') {
          client.send(data)
        } else if (data instanceof Buffer) {
          const text = data.toString('utf8');

          switch (true) {
            case /^mouse_up/.test(text):
              console.log(`index.js - line: 26 ->> up`,);
              await mouse.move(up(Number(text.split(' ')[1].trim())));
              break;

            case /^mouse_down/.test(text):
              console.log(`index.js - line: 34 ->> down`,);
              await mouse.move(down(Number(text.split(' ')[1].trim())));
              break;

            case /^mouse_left/.test(text):
              console.log(`index.js - line: 41 ->> left`,);
              await mouse.move(left(Number(text.split(' ')[1].trim())));
              break;

            case /^mouse_right/.test(text):
              console.log(`index.js - line: 48 ->> right`,);
              await mouse.move(right(Number(text.split(' ')[1].trim())));
              break;

            case /^mouse_position/.test(text):
              console.log(`index.js - line: 47 ->> mouse_position`,)

              const { x, y } = await mouse.getPosition()

              client.send(`mouse_position ${x},${y}`)
              break;

            case /^draw_circle/.test(text):
              console.log(`index.js - line: 47 ->> draw_circle`,)

              const { x: xC, y: yC } = await mouse.getPosition()
              const centerX = xC; // X coordinate of the center point
              const centerY = yC; // Y coordinate of the center point
              const radius = Number(text.split(' ')[1].trim()); // Radius of the circle
              const numSteps = Array.from({ length: 1000 }, (_, i) => i); // Number of steps for circular movement

              for await (const i of numSteps) {
                const angle = (Math.PI * 2 * i) / numSteps.length;
                const xCoord = centerX + (radius - radius * Math.cos(angle));
                const yCoord = centerY + radius * Math.sin(angle);
                await mouse.move(straightTo({ x: xCoord, y: yCoord }));
              }
              client.send(text.split(' ')[0])
              break;

            case /^draw_square/.test(text):
              console.log(`index.js - line: 47 ->> draw_square`,)

              const sideLength = Number(text.split(' ')[1].trim()); // Radius of the circle

              await mouse.move(up(sideLength));
              await mouse.move(right(sideLength));
              await mouse.move(down(sideLength));
              await mouse.move(left(sideLength));
              client.send(text.split(' ')[0])
              break;

            case /^draw_rectangle/.test(text):
              console.log(`index.js - line: 47 ->> draw_reactangle`,)

              const sideLengthLong = Number(text.split(' ')[2].trim()); // Radius of the circle
              const sideLengthShort = Number(text.split(' ')[1].trim()); // Radius of the circle

              await mouse.move(up(sideLengthShort));
              await mouse.move(right(sideLengthLong));
              await mouse.move(down(sideLengthShort));
              await mouse.move(left(sideLengthLong));
              client.send(text.split(' ')[0])
              break;
            
            case /^prnt_scrn/.test(text):
              console.log(`websocketServer.ts - line: 95 ->> prnt_scrn`)
              getScreenshot(client)

              break;

            default:
              client.send(text)
              break;
          }
        }
      }
    })
  })
})

httpServer.listen(HTTP_PORT);