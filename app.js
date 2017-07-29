var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/public')));

users = [];
numConnections = 0;

io.on('connection', function(socket){
    numConnections++;
    console.log('Connections: '+numConnections);

    socket.on('disconnect', function(){
        numConnections--;
        users.splice(users.indexOf(socket.username), 1);
        console.log('Connections: '+numConnections);
        console.log('Users Connected: '+users.length);
        io.emit('user left', {
            users: users,
            user: socket.username
        });
    });

    socket.on('new message', function(msg){
        io.emit('new message', {
            user: socket.username,
            msg: msg
        });
    });

    socket.on('user join', function(user){
        socket.username = user;
        users.push(user);
        console.log('Users Connected: '+users.length);
        io.emit('new user', {
            users: users,
            user: user
        });
    });
});

http.listen(port, function(){
    console.log('listening on port: ' + port);
});