import WebSocket, {WebSocketServer} from 'ws';
import {httpServer} from "./src/http_server/index.js";
import {mouse, left, right, up, down, straightTo} from "@nut-tree/nut-js";

// import pkg from '@nut-tree/nut-js';
// const {mouse, left, right, up, down, getPosition} = pkg;

const HTTP_PORT = 8181;

console.log( `Start static http server on the ${ HTTP_PORT } port!` );

const wss = new WebSocketServer( {server: httpServer} )

wss.on( 'connection', function connection ( ws ) {
  ws.on( 'message', function incoming ( data ) {

    wss.clients.forEach( async function each ( client ) {
      if ( !client !== ws && client.readyState === WebSocket.OPEN ) {
        if ( typeof data === 'string' ) {
          client.send( data )
        } else if ( data instanceof Buffer ) {
          const text = data.toString( 'utf8' );
          console.log( `index.js - line: 30 ->> text`, text )

          switch ( true ) {
            case /^mouse_up/.test( text ):
              console.log( `index.js - line: 26 ->> up`, );
              await mouse.move( up( Number( text.split( ' ' )[1].trim() ) ) );
              break;


            case /^mouse_down/.test( text ):
              console.log( `index.js - line: 34 ->> down`, );
              await mouse.move( down( Number( text.split( ' ' )[1].trim() ) ) );
              break;


            case /^mouse_left/.test( text ):
              console.log( `index.js - line: 41 ->> left`, );
              await mouse.move( left( Number( text.split( ' ' )[1].trim() ) ) );
              break;


            case /^mouse_right/.test( text ):
              console.log( `index.js - line: 48 ->> right`, );
              await mouse.move( right( Number( text.split( ' ' )[1].trim() ) ) );
              break;

            case /^mouse_position/.test( text ):
              console.log( `index.js - line: 47 ->> mouse_position`, )

              const {x, y} = await mouse.getPosition()

              console.log( `index.js - line: 52 ->> position`, x, y )
              // await mouse.move(right(Number(text.split(' ')[1].trim())));
              client.send( `mouse_position ${ x },${ y }` )
              break;

            case /^draw_circle/.test( text ):
              console.log( `index.js - line: 47 ->> draw_circle`, )

              // await mouse.move(right(Number(text.split(' ')[1].trim())));
              // client.send( `mouse_position ${x},${y}` )
              const {x: xC, y: yC} = await mouse.getPosition()

              console.log(`index.js - line: 66 ->> xC, yC`, xC, yC)

              const centerX = xC; // X coordinate of the center point
              const centerY = yC; // Y coordinate of the center point
              const radius = Number( text.split( ' ' )[1].trim() ); // Radius of the circle
              const numSteps = Array.from({length: 1000}, (_,i) => i); // Number of steps for circular movement
              
              console.log(`index.js - line: 71 ->> centerX, centerY, radius, numSteps`, centerX, centerY, radius, )

              for await ( const i of numSteps ) {
                // console.log(`index.js - line: 74 ->> move FOR`, i)

                // get current position

                const angle = ( Math.PI * 2 * i ) / numSteps.length;
                const xCoord = centerX + ( radius - radius * Math.cos( angle ) );
                const yCoord = centerY + radius * Math.sin( angle );
                // console.log(`index.js - line: 80 ->> angle, xCoord, yCoord`, angle, xCoord, yCoord )
                await mouse.move(straightTo({x: xCoord, y: yCoord}));
              }

              client.send( text.split( ' ' )[0] )

              break;
            
            case /^draw_square/.test( text ):
              console.log( `index.js - line: 47 ->> draw_circle`, )

              const sideLength = Number( text.split( ' ' )[1].trim() ); // Radius of the circle

              await mouse.move(up(sideLength));
              await mouse.move(right(sideLength));
              await mouse.move(down(sideLength));
              await mouse.move( left( sideLength ) );

              client.send( text.split( ' ' )[0] )

              break;
           
            case /^draw_rectangle/.test( text ):
              console.log( `index.js - line: 47 ->> draw_circle`, )

              const sideLengthLong = Number( text.split( ' ' )[2].trim() ); // Radius of the circle
              const sideLengthShort = Number( text.split( ' ' )[1].trim() ); // Radius of the circle

              await mouse.move(up(sideLengthShort));
              await mouse.move(right(sideLengthLong));
              await mouse.move(down(sideLengthShort));
              await mouse.move( left( sideLengthLong ) );
              

              client.send( text.split( ' ' )[0] )

              break;

            default:
              client.send( text )
              break;
          }

        }
      }
    } )
  } )
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