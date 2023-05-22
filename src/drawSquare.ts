import { down, left, mouse, right, up } from "@nut-tree/nut-js";
import { WebSocket } from 'ws';

const drawSquare = async (client: WebSocket, text: string) => {

  const sideLength = Number(text.split(' ')[1].trim()); // Radius of the circle

  await mouse.move(up(sideLength));
  await mouse.move(right(sideLength));
  await mouse.move(down(sideLength));
  await mouse.move(left(sideLength));
  client.send(text.split(' ')[0])

}

export { drawSquare };
