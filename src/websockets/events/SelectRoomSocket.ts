import { Socket } from "socket.io";

import { ConnectionsService } from "../../services/ConnectionsService";
import { MessagesService } from "../../services/MessagesService";
import { RoomsService } from "../../services/RoomsService";
import { UsersServices } from "../../services/UsersService";

import { IDataSelectRoom } from "../../dtos/IDataSelectRoom";

export default async (
  socket: Socket,
  { username, room }: IDataSelectRoom,
  callback: CallableFunction
) => {
  const usersServices = UsersServices.getInstance();
  const connectionsServices = ConnectionsService.getInstance();
  const roomsServices = RoomsService.getInstance();
  const messagesServices = MessagesService.getInstance();

  // Cadastrar o usuario
  const userExists = await usersServices.findByUsername(username);

  const user = userExists ? userExists : await usersServices.create(username);

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

  const newRoom = roomExists ? roomExists : await roomsServices.create(room);

  // Colocar o usuario em alguma sala em especifica na conexão de socket
  socket.join(newRoom.id);

  // Listar as mensagens dessa sala
  const messagesRoom = await messagesServices.listMessagesByRoom(newRoom.id);

  callback(messagesRoom, user);
};
