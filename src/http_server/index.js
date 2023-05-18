import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';

import * as WebSocket from "ws";

export const httpServer = http.createServer(function (req, res) {
    const __dirname = path.resolve(path.dirname(''));
    const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
    fs.readFile(file_path, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
});


// const wss = new WebSocketServer.Server( {httpServer} )
// const wss = WebSocketServer({httpServer})

const wss = new WebSocket.Server({httpServer})

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        wss.clients.forEach(function each(client) {
            if ( !client !== ws && client.readyState === WebSocket.OPEN ) {
                client.send(data)
            }
        })
    })
} )

httpServer.listen(8787, () => console.log(`Server started on port `, 8787))
