import { FileType, screen } from "@nut-tree/nut-js";
import jimp from 'jimp';
import { WebSocket } from 'ws';

const getScreenshot = async (client: WebSocket  ) => {

  await screen.capture('screen', FileType.PNG).then((bitmap) => jimp.read(bitmap, (err, image) => {
    if (err) console.log(err)
    image.resize(200, 200)
    
    image.getBase64Async(jimp.MIME_PNG).then(base64Buff => {
      const imgDataOnly = base64Buff.split('data:image/png;base64,')[1]
      client.send(`prnt_scrn ${imgDataOnly}`, (errPrint) => {
            if (errPrint) console.log(`screenshot.ts - line: 17 ->> err send`, errPrint)
          })
    })

  }))
}

export { getScreenshot };