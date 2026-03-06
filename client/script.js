const socket = io("https://chatsquare.onrender.com");

let username = prompt("Enter your name");

if(!username || username.trim()===""){
username = "Guest";
}

document.getElementById("currentUser").innerText = username;
socket.emit("join", username);

const messages = document.getElementById("messages");
const usersList = document.getElementById("users");
const typingText = document.getElementById("typing");
const msgInput = document.getElementById("msg");

let selectedUser = null;

/* RECEIVE PRIVATE MESSAGE */

socket.on("privateMessage", (data) => {

    const div = document.createElement("div");
    div.classList.add("message");

    div.innerHTML = `
        <div class="msgUser">${data.user}</div>
        <div class="msgText">${data.text}</div>
        <div class="msgTime">${data.time}</div>
    `;

    messages.appendChild(div);

    messages.scrollTop = messages.scrollHeight;
});


/* SYSTEM MESSAGE */

socket.on("system", (text) => {

    const div = document.createElement("div");
    div.classList.add("system");
    div.innerText = text;

    messages.appendChild(div);
});


/* ONLINE USERS LIST */

socket.on("userList", (users) => {

    usersList.innerHTML = "";

    users.forEach(([id, name]) => {

        const li = document.createElement("li");
        li.innerText = name;

        li.onclick = () => {

            selectedUser = id;

            document.querySelectorAll("#users li")
                .forEach(el => el.style.background = "transparent");

            li.style.background = "rgba(255,255,255,0.2)";
        };

        usersList.appendChild(li);
    });

});




/* SEND PRIVATE MESSAGE */

function sendMessage(){

const msg = msgInput.value.trim();

if(!msg) return;

if(!selectedUser){
alert("Select a user first");
return;
}

socket.emit("privateMessage",{
to:selectedUser,
message:msg
});

msgInput.value="";
}

// Disconnection
function disconnectUser(){

socket.disconnect();

alert("Disconnected from chat");

location.reload();


}
