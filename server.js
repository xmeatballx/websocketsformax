const http = require("http");
const cors = require("cors");

const io = require("socket.io");
let rooms = new Set();
let users = [];

const express = require("express");
const app = express();
const bodyparser = require("body-parser");
app.use(bodyparser.json());
app.use(cors());
app.get("/", (req, res) => res.sendFile(__dirname + "/client/index.html"));
app.post("/joinroom", (req, res) => {
})


const port = 3000;

const server = http.createServer(app);

const webSocketServer = require("socket.io")(server);

webSocketServer.on("connection", socket => {
    socket.on("room_name", (m) => {
        console.log(m);
        users.push(m);
        rooms.add(m.room);
        const thisUser = users.find(user => user.id == socket.id && user.room == m.room);
        const oldRoom = users.find(user => user.room != m.room);
        if (oldRoom != undefined) socket.leave(oldRoom.room);
        socket.join(thisUser.room);
        socket.on("out1", (m) => {
            console.log(m)
            socket.to(thisUser.room).broadcast.emit("cv_in1", m);
        })
        socket.on("out2", (m) => {
            console.log(m)
            socket.to(thisUser.room).broadcast.emit("cv_in2", m);
        })
        socket.on("out3", (m) => {
            console.log(m)
            socket.to(thisUser.room).broadcast.emit("cv_in3", m);
        })
        socket.on("out4", (m) => {
            console.log(m)
            socket.to(thisUser.room).broadcast.emit("cv_in4", m);
        })

        socket.on("out5", (m) => {
            console.log(m)
            socket.to(thisUser.room).broadcast.emit("cv_in5", m);
        })
        socket.on("out6", (m) => {
            console.log(m)
            socket.to(thisUser.room).broadcast.emit("cv_in6", m);
        })
        socket.on("out7", (m) => {
            console.log(m)
            socket.to(thisUser.room).broadcast.emit("cv_in7", m);
        })
        socket.on("out8", (m) => {
            console.log(m)
            socket.to(thisUser.room).broadcast.emit("cv_in8", m);
        })

        socket.on("disconnect", (reason) => {
            users = users.filter(user => user.id != socket.id);
        })
    })
})

// webSocketServer.on("room_name", (m) => {
//     console.log(m);
// })

server.listen(port);

