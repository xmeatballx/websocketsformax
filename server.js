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
        users.push(m);
        rooms.add(m.room);
        const thisUser = users.find(user => user.id == socket.id && user.room == m.room);
        console.log(thisUser);
        socket.join(thisUser.room);
        socket.on("cv_out1", (m) => {
            console.log(m)
            socket.to(thisUser.room).broadcast.emit("cv_in1", m);
            console.log(socket);
        })
        socket.on("cv_out2", (m) => {
            console.log(m)
            socket.to(thisUser.room).broadcast.emit("cv_in2", m);
        })
        socket.on("cv_out3", (m) => {
            console.log(m)
            socket.to(thisUser.room).broadcast.emit("cv_in3", m);
        })
        socket.on("cv_out4", (m) => {
            console.log(m)
            socket.to(thisUser.room).broadcast.emit("cv_in4", m);
        })

        socket.on("disconnect", (reason) => {
            users = users.filter(user => user.id != socket.id);
        })
    })
})

webSocketServer.on("room_name", (m) => {
    console.log(m);
})

server.listen(port);

