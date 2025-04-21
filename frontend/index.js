const socket = io();
const urlString = window.location.href; // Get the full current URL
const url = new URL(urlString);
const roomId = url.searchParams.get('code'); // Get the value of the 'code' parameter
const role = url.searchParams.get('role')
const username = prompt("Enter your username")

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('gameCode').textContent = roomId;
  if(role === "master"){
    document.getElementById('startBtn').classList.remove('disabled');
  }
});

socket.emit("joinRoom", { roomId, username, role });


socket.on("playerListUpdate", (players) => {  
  const waitDiv = document.getElementById('waiting')
  waitDiv.innerHTML = "";
  players.forEach(player => {
    const innerDiv = document.createElement('div')
    innerDiv.classList.add('user')
    innerDiv.textContent = player.username;
    waitDiv.appendChild(innerDiv);
  });
});


function loadGameRoom() {
  socket.emit("startGame", roomId);
}
socket.on("gameStarted", (roomId) => {
  window.location.href = `./game-chat.html?sessionId=${roomId}`;
        // Next phase: move everyone to game.html

})
