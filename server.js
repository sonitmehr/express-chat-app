const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./util/messages");
const {userJoin,getCurrentUser,userLeaves,getRoomUsers}= require("./util/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT =  process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id,username,room);

        socket.join(room);

        // emit sends message to client side.
        socket.emit('botMessage', 'Welcome to ChatBot!');

        // emits to all other clients except the current client's chat.
        socket.broadcast.to(room).emit('botMessage', `${username} has joined the chat.`);
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users:getRoomUsers(user.room),
    
        });
    });

    // Send user and room info
    


    

    

    // Emit chat message
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
        //socket.broadcast.to(user.room).emit('message', formatMessage(user.username, msg));
        // io.sockets.emit('chatMessage', formatMessage(user.username, msg));
    });
    
    // Runs when client disconnects.
    socket.on('disconnect', () => {
        const user = userLeaves(socket.id);
        if(user){
            io.to(user.room).emit('botMessage', `${user.username} has left the chat.`);
            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users:getRoomUsers(user.room),
        
            });
        }
        
    });

});

server.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});

module.exports = app;