const socket = io()

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

const autoscroll = () => {
    const $newMessage = $messages.lastElementChild

    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    const visibleHeight = $messages.offsetHeight
    const containerHeight = $messages.scrollHeight

    const scrollOffset = $messages.scrollTop + visibleHeight
    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on("message", (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML("beforeend", html)
    autoscroll()
})

$messageForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const message = $messageInput.value

    socket.emit("sendMessage", message, (error) => {
        $messageInput.value = ""
        $messageInput.focus()
        
        if (error) {
            return alert(error)
        }
    })
})

$buttonLocation.addEventListener("click", () => {
    $buttonLocation.setAttribute("disabled", "disabled")

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords
            socket.emit("position", { latitude, longitude }, (message) => {
                $buttonLocation.removeAttribute("disabled")
            })
        })
    } else {
        alert("could not shared location!")
    }
})

socket.on("linkPosition", (message) => {
    const html = Mustache.render(positionTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format("h:mm a")
     })
    $messages.insertAdjacentHTML("beforeend", html)
    autoscroll()
})

socket.on("roomData", ({room, users}) => {
   const html = Mustache.render(sidebarTemplate, {
        room,
        users
   })
   $sidebar.innerHTML = html
})

socket.emit("join", {username, room}, (error) => {
    if(error) {
        alert(error)
        location.href = "/"
    }
})