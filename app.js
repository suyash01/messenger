const express = require('express');
const path = require('path');

const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/public')));

users = {};

io.on('connection', function(client){

    client.on('disconnect', function(){
        io.emit('notification', 1, users[client.id]);
        delete users[client.id];
        console.log('Users Online: ' + Object.keys(users).length);
        io.emit('update users', users);
    });

    client.on('message', function(msg){
        io.emit('message', users[client.id], msg);
    });

    client.on('join', function(name){
        if(name != "" && name != null && name != undefined){
            users[client.id] = name;
            console.log('Users Online: ' + Object.keys(users).length);
            io.emit('update users', users);
            io.emit('notification', 0, users[client.id]);
        }
    });
});

http.listen(port, function(){
    console.log('listening on port: ' + port);
});
