import { io } from "../http";

import { IDataSelectRoom } from "../dtos/IDataSelectRoom";
import { IDataSendMessage } from "../dtos/IDataSendMessage";

// Criar uma tabela de connections (para socket.id)
// Criar uma tabela de salas
// Criar uma tabela de messages, com fkUserReceiver podendo ser nulo e tento relacionamento com room

interface IRoomUser {
  socket_id: string;
  username: string;
  room: string;
}

interface IMessage {
  room: string;
  text: string;
  username: string;
  createdAt: Date;
}

const users: IRoomUser[] = [];

const messages: IMessage[] = [];

const getMessagesRoom = (room: string) => {
  const messagesRoom = messages.filter((message) => message.room === room);

  return messagesRoom;
};

io.on("connection", (socket) => {
  socket.on("select_room", ({ username, room }: IDataSelectRoom, callback) => {
    // Colocar o usuario em alguma sala em especifica na conexão de socket
    socket.join(room);

    const userInRoom = users.find(
      (user) => user.username === username && user.room === room
    );

    if (userInRoom) {
      userInRoom.socket_id = socket.id;
    } else {
      users.push({
        room: room,
        username: username,
        socket_id: socket.id,
      });
    }

    const messagesRoom = getMessagesRoom(room);

    callback(messagesRoom);
  });

  socket.on("message", ({ room, text, username }: IDataSendMessage) => {
    // Salvar mensagens
    const message: IMessage = {
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
