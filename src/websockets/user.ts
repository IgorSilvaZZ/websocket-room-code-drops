import { io } from "../http";

import { IDataSelectRoom } from "../dtos/IDataSelectRoom";
import { IDataSendMessage } from "../dtos/IDataSendMessage";

import { UsersServices } from "../services/UsersService";
import { RoomsService } from "../services/RoomsService";
import { MessagesService } from "../services/MessagesService";
import { ConnectionsService } from "../services/ConnectionsService";
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

io.on("connection", (socket) => {
  const usersServices = new UsersServices();
  const connectionsServices = new ConnectionsService();
  const roomsServices = new RoomsService();
  const messagesServices = new MessagesService();

  socket.on("access_chat", async ({ username }, callback) => {
    const user = await usersServices.create(username);

    callback(user);
  });

  socket.on(
    "select_room",
    async ({ username, room }: IDataSelectRoom, callback) => {
      // Cadastrar o usuario
      const user = await usersServices.create(username);

      // Conectar o usuario e dizer que ele está online
      await connectionsServices.create({
        socketId: socket.id,
        userId: user?.id,
      });

      // Criar a sala ou retornar o id da sala
      const newRoom = await roomsServices.create(room);

      // Colocar o usuario em alguma sala em especifica na conexão de socket
      socket.join(newRoom.id);

      // Listar as mensagens dessa sala
      const messagesRoom = await messagesServices.listMessagesByRoom(
        newRoom.id
      );

      callback(messagesRoom);
    }
  );

  socket.on(
    "message",
    async ({ room, text, userSenderId }: IDataSendMessage) => {
      // Criando ou recuperando sala que contem no banco de dados
      const { id: roomId } = await roomsServices.create(room);

      // Salvar mensagens
      const message = await messagesServices.create({
        roomId,
        text,
        userSenderId,
      });

      // Listando todas as mensagens daquela sala apos ser criada uma nova
      const messages = await messagesServices.listMessagesByRoom(roomId);

      // Enviar para os usuarios da sala especifica
      io.to(roomId).emit("message", messages);
    }
  );
});
