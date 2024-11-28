const port = 8000;

// server code
let WebSocketServer = require('ws').Server;
let server = new WebSocketServer({port: port});

console.log("WebSocket sever is running.");
console.log("Listening to port " + port + ".");

let User = require('./gameLogic').User;
let Room = require('./gameLogic').Room;
let room1 = new Room();


server.on('connection', function (socket){
    let user = new User(socket);
    room1.addUser(user);

    console.log("A connection to server established");
});
