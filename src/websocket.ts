import { io } from "./http";

interface IRoomUser {
  socket_id: string;
  username: string;
  room: string;
}

interface Message {
  room: string;
  text: string;
  username: string;
  createdAt: Date;
}

const users: IRoomUser[] = [];

const messages: Message[] = [];

const getMessagesRoom = (room: string) => {
  const messagesRoom = messages.filter((message) => message.room === room);

  return messagesRoom;
};

io.on("connection", (socket) => {
  socket.on("select_room", (data, callback) => {
    // Colocar o usuario em alguma sala em especifica na conexão de socket
    socket.join(data.room);

    const userInRoom = users.find(
      (user) => user.username === data.username && user.room === data.room
    );

    if (userInRoom) {
      userInRoom.socket_id = socket.id;
    } else {
      users.push({
        room: data.room,
        username: data.username,
        socket_id: socket.id,
      });
    }

    const messagesRoom = getMessagesRoom(data.room);

    callback(messagesRoom);
  });

  socket.on("message", ({ room, text, username }) => {
    // Salvar mensagens
    const message: Message = {
      room,
      text,
      username,
      createdAt: new Date(),
    };

    messages.push(message);

    // Enviar para os usuarios da sala especifica
    io.to(room).emit("message", message);
  });
});
