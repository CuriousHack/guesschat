const socket = io();
const urlString = window.location.href; // Get the full current URL
const url = new URL(urlString);
const roomId = url.searchParams.get('code'); // Get the value of the 'code' parameter
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
      
      // Step 3: Fetch target page
      fetch("game-chat.html")
        .then(res => res.text())
        .then(html => {
          // Step 4: Replace body with new page
          document.body.innerHTML = html;

          // Step 5: Manually re-run necessary scripts
          loadChatScript();
        });
    }
  }, 1000);
});

function loadChatScript() {
  console.log(window.location.pathname)
  const script = document.createElement('script');
  script.src = './js/chat.js'; // Or wherever your chat logic is
  script.defer = true;
  document.body.appendChild(script);
}

