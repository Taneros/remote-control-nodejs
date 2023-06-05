import { down, left, mouse, right, up } from "@nut-tree/nut-js";
import WebSocket, { WebSocketServer } from 'ws';
import { drawCircle } from './drawCircle';
import { drawRectangle } from './drawRectangle';
import { drawSquare } from './drawSquare';
import { httpServer } from "./http_server/index";
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
              await mouse.move(up(Number(text.split(' ')[1].trim())));
              break;

            case /^mouse_down/.test(text):
              await mouse.move(down(Number(text.split(' ')[1].trim())));
              break;

            case /^mouse_left/.test(text):
              await mouse.move(left(Number(text.split(' ')[1].trim())));
              break;

            case /^mouse_right/.test(text):
              await mouse.move(right(Number(text.split(' ')[1].trim())));
              break;

            case /^mouse_position/.test(text):
              const { x, y } = await mouse.getPosition()
              client.send(`mouse_position ${x},${y}`)
              break;

            case /^draw_circle/.test(text):
              drawCircle(client, text)
              break;

            case /^draw_square/.test(text):
              drawSquare(client, text)
              break;

            case /^draw_rectangle/.test(text):
              drawRectangle(client, text)
              break;
            
            case /^prnt_scrn/.test(text):
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