import { mouse, straightTo } from "@nut-tree/nut-js";
import { WebSocket } from 'ws';

const drawCircle = async (client: WebSocket, text: string) => {

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

}

export { drawCircle };

