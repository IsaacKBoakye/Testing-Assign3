//Server Code

//get express server
const express = require('express');

//call express
const app = express();

//get socket.io
const socketIO = require('socket.io');

//get http
const http = require('http');

// const {httpServer,io } = require('./server');


app.get('/', (req, res) => {
    // res.send('Hello World');
    res.sendFile(`${__dirname}/chat.html`);
});



//listening on port 3000
// app.listen(3000, function(){
//     console.log('listening on 3000');
// });


//launch server and bindsocket.io
const httpServer = http.createServer(app).listen(3000);
const io = socketIO(httpServer);


//trying to count the number of connections

let count = 0;



// set up first node event handler
io.on('connection', (socket) => {
    console.log('Client Connected');
    count++;

    // display popup message that a new user has joined the chat
    io.emit('new_user', 'A new user has joined the chat');

    // radical - make and send our own event
    socket.emit('welcome', 'Welcome to the APPD5015 Chat Server');

    // handle new chat event from the client
    socket.on('message', (newChat) => {
        console.log(newChat);

        //add timestamp
        newChat.timestamp = new Date().toLocaleString();

        // send this message to anyone in the chat room
        io.emit('new_message', newChat);
    });

    // set up second node event handler
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        count--;

        // display popup message that a user has left the chat
        io.emit('user_left', 'A user has left the chat');
        
        // Emit the updated count to all connected clients
        io.emit('count', count);
    });
});

// Outside Client Socket Connection Handler
setInterval(() => {
    io.emit('server_time', new Date().toTimeString());
    io.emit('count', count);
}, 1000);


//export app
module.exports = app;