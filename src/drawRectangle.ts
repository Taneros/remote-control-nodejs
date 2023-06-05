import { down, left, mouse, right, up } from "@nut-tree/nut-js";
import { WebSocket } from 'ws';

const drawRectangle = async (client: WebSocket, text: string) => {

  const sideLengthLong = Number(text.split(' ')[2].trim()); // Radius of the circle
  const sideLengthShort = Number(text.split(' ')[1].trim()); // Radius of the circle

  await mouse.move(up(sideLengthShort));
  await mouse.move(right(sideLengthLong));
  await mouse.move(down(sideLengthShort));
  await mouse.move(left(sideLengthLong));
  client.send(text.split(' ')[0])

}

export { drawRectangle };
