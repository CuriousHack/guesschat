const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

const appendMessage = (username, msg) => {
    const messageDiv = document.createElement('div');
    const divSpan = document.createElement('span');
    const msgText = document.createElement('p');

    messageDiv.classList.add('message');
    divSpan.classList.add('sender');

    if(username === userName){
        messageDiv.classList.add('sent')
        divSpan.innerText = username;
    }
    else{
        messageDiv.classList.add('received');
        divSpan.innerText = username;

    }

    msgText.innerText = msg

    messageDiv.appendChild(divSpan);
    messageDiv.appendChild(msgText);
    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}


function sendMessage(){
    const msg = document.getElementById('user-input').value
    if(msg){
        
        // socket.emit("chat", { username, message: msg })
        socket.emit("gameChat", { roomId, userName, message: msg });
        userInput.value = ""
    }
}

socket.on("chatMsg", (data) => {
    appendMessage(data.userName, data.message);
})