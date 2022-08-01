const socket = io();

const urlSearch = new URLSearchParams(window.location.search);

const username = urlSearch.get("username");
const room = urlSearch.get("select_room");

function createMessage(data) {
  const messagesDiv = document.getElementById("messages");

  messagesDiv.innerHTML += `
      <div class="new_message">
          <label class="form-label">
              <strong>${data.username}</strong> <span>${data.text} - ${dayjs(
    data.createdAt
  ).format("DD/MM HH:mm")}</span>
          </label>
      </div>
    `;
}

document.getElementById(
  "username"
).innerHTML = `Olá ${username} - Você está na sala: ${room}`;

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
        username,
      };

      event.target.value = "";

      socket.emit("message", data);
    }
  });

socket.on("message", (data) => {
  createMessage(data);
});

document.getElementById("logout").addEventListener("click", () => {
  window.location.href = "index.html";
});
