const path = require("path")
const express = require("express")
const http = require("http")
const socketio = require("socket.io")
const Filter = require("bad-words")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = process.env.PORT | 3000
const publicDirPath = path.join(__dirname, "../public")
app.use(express.static(publicDirPath))


io.on("connection", (socket) => {
    console.log("new websocket connection")

    socket.emit("message", "Welcome")

    socket.broadcast.emit("message", "A new user joined")

    socket.on("sendMessage", (message, callback) => {
        const filter = new Filter()
        if(filter.isProfane(message)) {
            return callback("profanity is not allowed")
        }

        io.emit("message", message)
        callback()
    })

    socket.on("position", (pos, callback) => {
        io.emit("linkPosition", pos)
        callback()
    })

    socket.on("disconnect", () => {
        io.emit("message", "A user has left")
    })
})

server.listen(PORT)