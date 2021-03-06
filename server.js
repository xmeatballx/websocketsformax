const http = require("http");
const cors = require("cors");

const io = require("socket.io");
let users = [];

const express = require("express");
const app = express();
const bodyparser = require("body-parser");
app.use(bodyparser.json());
app.use(cors());
app.get("/", (req, res) => res.sendFile(__dirname + "/client/index.html"));

const Queue = require("./queue");
const { Console } = require("console");

let uniqueReceivers = new Set();
let receivers = new Array();

const port = 3000;

const server = http.createServer(app);

const webSocketServer = require("socket.io")(server);

webSocketServer.on("connection", socket => {
    socket.on("room_name", (m) => {
        console.log(m);
        users.push(m);
        const thisUser = users.find(user => user.id == socket.id && user.room == m.room);
        socket.rooms = {};
        if (thisUser != undefined) socket.join(thisUser.room);
        socket.on("leave_room", (m) => {
            socket.rooms = {};
            thisUser.room = '';
            // console.log(socket.rooms);
        })
        thisQueue = new Queue();
        socket.on("chat_message", function (m) {
            if (thisQueue.contents.length > 10) {
                thisQueue.dequeue();
            }
            thisQueue.enqueue(m);
            // console.log(thisQueue.contents);
            webSocketServer.to(socket.id).emit("self_chat_message", thisQueue.contents);
            socket.in(thisUser.room).broadcast.emit("chat_message", thisQueue.contents);
        })

        socket.on("out1", (m) => {
            // console.log(thisUser.room);
            // console.log(m)
            socket.to(thisUser.room).broadcast.emit("cv_in1", m);
        })
        socket.on("out2", (m) => {
            // console.log(m)
            socket.to(thisUser.room).broadcast.emit("cv_in2", m);
        })
        socket.on("out3", (m) => {
            // console.log(m)
            socket.to(thisUser.room).broadcast.emit("cv_in3", m);
        })
        socket.on("out4", (m) => {
            // console.log(m)
            socket.to(thisUser.room).broadcast.emit("cv_in4", m);
        })

        socket.on("out5", (m) => {
            console.log(m)
            socket.to(thisUser.room).broadcast.emit("cv_in5", m);
        })
        socket.on("out6", (m) => {
            // console.log(m)
            socket.to(thisUser.room).broadcast.emit("cv_in6", m);
        })
        socket.on("out7", (m) => {
            // console.log(m)
            socket.to(thisUser.room).broadcast.emit("cv_in7", m);
        })
        socket.on("out8", (m) => {
            // console.log(m)
            socket.to(thisUser.room).broadcast.emit("cv_in8", m);
        })

        socket.on("disconnect", (reason) => {
            users = users.filter(user => user.id != socket.id);
        })
    })

    dmQueue = new Queue();

    socket.on("DM_IN", (m) => {
        let r = {
            name: m.from,
            id: socket.id
        }
        if (!receivers.some((receiver) => { return receiver.name === r.name; })) receivers.push(r);
        const peer = receivers.filter((r) => r.name == m.to);
        if (peer[0] != undefined) {
            if (dmQueue.length > 10) dmQueue.dequeue();
            dmQueue.enqueue(`${m.from}: ${m.message}`);
            webSocketServer.to(socket.id).emit("DM_OUT", dmQueue.contents);
            webSocketServer.to(peer[0].id).emit("DM_OUT", dmQueue.contents);
        }
    });
})

// webSocketServer.on("room_name", (m) => {
//     console.log(m);
// })

server.listen(port);

