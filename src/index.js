const path = require("path")
const express = require("express")
const http = require("http")
const socketio = require("socket.io")
const Filter = require("bad-words")
const { generateMessage, generateLocationMessage } = require("./utils/messages")
const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/users")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = process.env.PORT || 3000
const publicDirPath = path.join(__dirname, "../public")
app.use(express.static(publicDirPath))

io.on("connection", (socket) => {

    socket.on("join", (data, callback) => {
        const {error, user} = addUser({id: socket.id, ...data})

        if(error) {
            return callback(error)
        }

        socket.join(user.room)
        
        socket.emit("message", generateMessage("System", `Welcome, ${user.username}`))
        socket.broadcast.to(user.room).emit("message", generateMessage("System", `${user.username} has joined!`))
        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on("sendMessage", (message, callback) => {
        const filter = new Filter()
        const {username, room} = getUser(socket.id)

        if(filter.isProfane(message)) {
            return callback("profanity is not allowed")
        }

        io.to(room).emit("message", generateMessage(username, message))
        callback()
    })

    socket.on("position", (pos, callback) => {
        const {username, room} = getUser(socket.id)
        const url = `https://google.com/maps?q=${pos.latitude},${pos.longitude}`
        
        io.to(room).emit("linkPosition", generateLocationMessage(username, url))
        callback()
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id)

        if(user) {
            io.to(user.room).emit("message", generateMessage("System", `${user.username} has left!`))
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(PORT)
