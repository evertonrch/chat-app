const server = io()

// elements
const $messageForm = document.querySelector(".form")
const $messageInput = $messageForm.querySelector("input")
const $buttonLocation = document.querySelector("#send-location")
const $locationLink = document.querySelector(".link")
const $messages = document.querySelector("#messages")
const $position = document.querySelector("#position")


// templates
const messageTemplate = document.querySelector("#message-template").innerHTML
const positionTemplate = document.querySelector("#position-template").innerHTML

server.on("message", (message) => {
    const html = Mustache.render(messageTemplate, {
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
        url: message.url,
        createdAt: moment(message.createdAt).format("h:mm a")
     })
    $messages.insertAdjacentHTML("beforeend", html)
})