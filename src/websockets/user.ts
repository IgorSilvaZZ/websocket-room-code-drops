import { io } from "../http";

import { IDataSelectRoom } from "../dtos/IDataSelectRoom";
import { IDataSendMessage } from "../dtos/IDataSendMessage";

import { UsersServices } from "../services/UsersService";
import { RoomsService } from "../services/RoomsService";
import { MessagesService } from "../services/MessagesService";
import { ConnectionsService } from "../services/ConnectionsService";

io.on("connection", (socket) => {
  const usersServices = new UsersServices();
  const connectionsServices = new ConnectionsService();
  const roomsServices = new RoomsService();
  const messagesServices = new MessagesService();

  socket.on(
    "select_room",
    async ({ username, room }: IDataSelectRoom, callback) => {
      // Cadastrar o usuario
      const userExists = await usersServices.findByUsername(username);

      const user = userExists
        ? userExists
        : await usersServices.create(username);

      // Conectar o usuario e dizer que ele está online
      const connection = await connectionsServices.findConnectionUser(
        String(user?.id)
      );

      if (connection) {
        await connectionsServices.updateSocketId(connection.id, socket.id);
      } else {
        await connectionsServices.create({
          socketId: socket.id,
          userId: user?.id,
        });
      }

      // Criar a sala ou retornar o id da sala
      const roomExists = await roomsServices.findByNameRoom(room);

      const newRoom = roomExists
        ? roomExists
        : await roomsServices.create(room);

      // Colocar o usuario em alguma sala em especifica na conexão de socket
      socket.join(newRoom.id);

      // Listar as mensagens dessa sala
      const messagesRoom = await messagesServices.listMessagesByRoom(
        newRoom.id
      );

      callback(messagesRoom, user);
    }
  );

  socket.on(
    "message",
    async ({ room, text, userSenderId }: IDataSendMessage) => {
      // Criando ou recuperando sala que contem no banco de dados
      const roomExists = await roomsServices.findByNameRoom(room);

      const roomId = roomExists?.id;

      // Salvar mensagens
      await messagesServices.create({
        roomId,
        text,
        userSenderId,
      });

      // Listando todas as mensagens daquela sala apos ser criada uma nova
      const messages = await messagesServices.listMessagesByRoom(roomId);

      // Enviar para os usuarios da sala especifica
      io.to(String(roomId)).emit("message", messages);
    }
  );

  socket.on("logout", async ({ userId }) => {
    const connection = await connectionsServices.findConnectionUser(userId);

    if (connection) {
      await connectionsServices.updateSocketId(connection.id, "");
    }
  });
});
