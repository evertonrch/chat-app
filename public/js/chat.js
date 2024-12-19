const server = io()

// elements
const $messageForm = document.querySelector(".form")
const $messageInput = $messageForm.querySelector("input")
const $buttonLocation = document.querySelector("#send-location")
const $locationLink = document.querySelector(".link")
const $messages = document.querySelector("#messages")
const $position = document.querySelector("#position")
const $sidebar = document.querySelector("#sidebar")


// templates
const messageTemplate = document.querySelector("#message-template").innerHTML
const positionTemplate = document.querySelector("#position-template").innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML

// query string parser
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })

server.on("message", (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML("beforeend", html)
})

$messageForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const message = $messageInput.value

    server.emit("sendMessage", message, (error) => {
        if (error) {
            return console.log(error)
        }
        console.log("delivered")
    })
})

$buttonLocation.addEventListener("click", () => {
    $buttonLocation.setAttribute("disabled", "disabled")

    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        server.emit("position", { latitude, longitude }, (message) => {
            $buttonLocation.removeAttribute("disabled")
        })
    })
})

server.on("linkPosition", (message) => {
    const html = Mustache.render(positionTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format("h:mm a")
     })
    $messages.insertAdjacentHTML("beforeend", html)
})

server.on("roomData", ({room, users}) => {
   const html = Mustache.render(sidebarTemplate, {
        room,
        users
   })
   $sidebar.innerHTML = html
})

server.emit("join", {username, room}, (error) => {
    if(error) {
        alert(error)
        location.href = "/"
    }
})