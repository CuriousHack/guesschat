const socket = io();
const urlString = window.location.href;
const url = new URL(urlString);
const roomId = url.searchParams.get('code');
const role = url.searchParams.get('role') ?? "Player";
const userName = prompt("Enter your username")

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('gameCode').textContent = roomId;
  if(role === "master"){
    document.getElementById('startBtn').classList.remove('disabled');
  }
});

socket.emit("joinRoom", { roomId, userName, role });


socket.on("playerListUpdate", (players) => {  
  const waitDiv = document.getElementById('waiting')
  waitDiv.innerHTML = "";
  players.forEach(player => {
    const innerDiv = document.createElement('div')
    innerDiv.classList.add('user')
    innerDiv.textContent = player.userName;
    waitDiv.appendChild(innerDiv);
  });
});


function loadGameRoom() {
  socket.emit("startGame", roomId);
}

//socket error handler
socket.on("error", (data) => {
  showToast(data, 'error')  
})

socket.on("gameStarted", (roomId) => {
  // Step 1: Soft redirect
  history.pushState({}, "", `game-chat.html?username=${userName}&code=${roomId}&role=${role}`);

  // Step 2: Show preloader in current page
  document.body.innerHTML = `
    <div class="preloader-container">
      <h1>Game starting in</h1>
      <div class="circle" id="countdown">5</div>
    </div>
  `;

  // Preloader countdown
  let counter = 5;
  const countdown = document.getElementById("countdown");
  const interval = setInterval(() => {
    counter--;
    countdown.textContent = counter;
    if (counter <= 0) {
      clearInterval(interval);
      
      fetch("game-chat.html")
        .then(res => res.text())
        .then(html => {
          document.body.innerHTML = html;

          loadChatScript();
        });
    }
  }, 1000);
});

function loadChatScript() {
  const script = document.createElement('script');
  script.src = './js/chat.js';
  script.defer = true;

  script.onload = () => {
    if(role == 'master'){
      startQue();  
    }
    
  };

  document.body.appendChild(script);
}

function startQue(){
    socket.emit('startQue')
}


function showToast(message, type = 'success', duration = 3000) {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');

      toast.classList.add('toast', type);
      toast.textContent = message;

      container.appendChild(toast);

      // Trigger the animation
      setTimeout(() => {
        toast.classList.add('show');
      }, 100);

      // Hide after duration
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }