import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./users', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the users database.');
});

const app = express();

var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var cors = require('cors')
app.use(cors())

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

const waitingPlayers = new Map<string, WebSocket>();
const games = new Map<WebSocket,WebSocket>();

wss.on('connection', (ws: WebSocket) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {

        if(waitingPlayers.get(message) === undefined || waitingPlayers.get(message) === null) {
            var player = null;
            games.forEach((val, key) => {
                if(val === ws) {
                    player = key;
                    return;
                }
                if(key === ws) {
                    player = val;
                    return;
                }
            });
            if(player === null) {
                waitingPlayers.set(message,ws);
                console.log("New player added to lobby: " + message);
            } else {
                player.send(message);
                console.log("Send message to second player: " + message);
            }
            
        } else {
            games.set(ws, waitingPlayers.get(message));
            var w = waitingPlayers.get(message);
            waitingPlayers.delete(message);
            var wsKey = null;
            waitingPlayers.forEach((val, key) => {
                if(val === ws) {
                    wsKey = key;
                }
            })
            if(wsKey !== null) {
                waitingPlayers.delete(wsKey);
            }
            ws.send('white');
            w.send('black');
            console.log("Start new game for players: " + message + " " + wsKey);
        }
        
        //log the received message and send it back to the client
        console.log('received: %s', message);

        var keys = [];
        waitingPlayers.forEach((val, key) => {
            keys.push(key);
        })
        console.log(keys);
        waitingPlayers.forEach((val, key) => {
            val.send(keys.toString());
        })
    });

    ws.on('close', () => {
        console.log("Client disconnected");
        var wsKey = null;
        waitingPlayers.forEach((val, key) => {
            if (val === ws) {
                wsKey = key;
            }
        })
        if (wsKey !== null) {
            waitingPlayers.delete(wsKey);
        }
        wsKey = null;
        var other = null;
        games.forEach((val, key) => {
            if (val === ws) {
                wsKey = key;
                other = key;
            }
            if (key === ws) {
                wsKey = key;
                other = val;
            }
        })
        if (wsKey !== null) {
            waitingPlayers.delete(wsKey);
        }
        if(other !== null) {
            other.send("close");
        }
    });

    //send immediatly a feedback to the incoming connection    
    //ws.send('Hi there, I am a WebSocket server');
});

app.options('*', cors())

var router = express.Router();
router.post('/login', function(req, res) {
    db.get('SELECT name, password FROM users WHERE name=? AND password=?',[req.body.name,req.body.password], function (err, row) {
        if(row !== undefined && row !== null) {
            console.log(row.name + ': ' + row.password)
            res.statusCode = 200;
        } else {
            console.log(row);
            console.log(err);
            res.statusCode = 401;
        }
        res.json({});
    });
    
})

router.post('/register', function(req, res) {
    db.get('SELECT name, password FROM users WHERE name=?',[req.body.name], function (err, row) {
        if(row !== undefined && row !== null) {
            console.log(row.name + ': ' + row.password)
            res.statusCode = 409;
            res.json({});
            return;
        } else {
            console.log(row);
            console.log(err);
            db.run('INSERT into users(name, password) VALUES(?,?)',[req.body.name,req.body.password], (err,row) => {
                if(err) {
                    console.log(err);
                }
                res.statusCode = 200;
                res.json({});
                return;
            }); 
        }
    });
    
})

app.use('/api', router);

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log("Server started on port " + 8999);
});