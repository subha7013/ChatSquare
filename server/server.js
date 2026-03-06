const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });



let users = {};

io.on("connection", (socket) => {

    socket.on("join", (username) => {

        users[socket.id] = username;

        io.emit("system", username + " joined the chat");

        io.emit("userList", Object.entries(users));
    });

    socket.on("privateMessage", ({to, message}) => {

        io.to(to).emit("privateMessage", {
            user: users[socket.id],
            text: message,
            time: new Date().toLocaleTimeString()
        });

        socket.emit("privateMessage", {
            user: users[socket.id],
            text: message,
            time: new Date().toLocaleTimeString()
        });

    });

    socket.on("disconnect", () => {

        const name = users[socket.id];

        delete users[socket.id];

        io.emit("system", name + " left the chat");

        io.emit("userList", Object.entries(users));
    });

});
server.listen(3000, () => console.log("Server running"));

