const socket = io.connect(window.location.origin);

let selectedUser = "";
let chatHistories = {}; 

// SELECT USER FUNCTION
function selectUser(user) {
    selectedUser = user;
    document.getElementById("chat-title").textContent = `Chat with ${user}`;
    document.getElementById("messages").innerHTML = ""; 
}

// SEND MESSAGE OR FILE
function sendMessage() {
    if (!selectedUser) {
        alert("Select a contact first!");
        return;
    }

    const messageInput = document.getElementById("message");
    const fileInput = document.getElementById("fileInput");

    const message = messageInput.value.trim();
    if (message) {
        socket.emit("message", { receiver: selectedUser, message });
        displayMessage(`You: ${message}`, "sent");
        messageInput.value = "";
    }

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
            socket.emit("file", {
                receiver: selectedUser,
                fileName: file.name,
                fileData: event.target.result.split(',')[1]
            });

            displayMessage(`You sent a file: ${file.name}`, "sent");
        };
        reader.readAsDataURL(file);
        fileInput.value = "";
    }
}

// DISPLAY MESSAGE FUNCTION
function displayMessage(content, type) {
    const messagesDiv = document.getElementById("messages");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", type);
    messageElement.innerHTML = content;
    messagesDiv.appendChild(messageElement);
}

// RECEIVE MESSAGES
socket.on("file", (data) => {
    displayMessage(`${data.sender} sent a file: <a href="${data.filePath}" download>${data.fileName}</a>`, "received");
});
