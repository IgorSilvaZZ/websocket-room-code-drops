const socket = io();

const urlSearch = new URLSearchParams(window.location.search);

const username = urlSearch.get("username");
const room = urlSearch.get("select_room");

let user = new Object();

function createMessage({ text, userSender: { username }, created_at }) {
  const messagesDiv = document.getElementById("messages");

  /* messagesDiv.innerHTML = ""; */

  messagesDiv.innerHTML += `
      <div class="new_message">
          <label class="form-label">
              <strong>${username}</strong> <span>${text} - ${dayjs(
    created_at
  ).format("DD/MM HH:mm")}</span>
          </label>
      </div>
    `;
}

document.getElementById(
  "username"
).innerHTML = `Olá ${username} - Você está na sala: ${room}`;

socket.emit(
  "access_chat",
  {
    username,
  },
  (data) => {
    user = data;
  }
);

socket.emit(
  "select_room",
  {
    username,
    room,
  },
  (messages) => {
    messages.forEach((message) => {
      createMessage(message);
    });
  }
);

document
  .getElementById("message_input")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const text = event.target.value;

      const data = {
        room,
        text,
        userSenderId: user.id,
      };

      event.target.value = "";

      socket.emit("message", data);
    }
  });

socket.on("message", (messages) => {
  document.getElementById("messages").innerHTML = "";

  messages.forEach((message) => {
    createMessage(message);
  });
});

document.getElementById("logout").addEventListener("click", () => {
  socket.emit("logout", { userId: user.id });

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
});
