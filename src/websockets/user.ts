import { io } from "../http";

import selectRoomSocket from "./events/SelectRoomSocket";
import logoutSocket from "./events/LogoutSocket";

import { IDataSelectRoom } from "../dtos/IDataSelectRoom";
import { IDataSendMessage } from "../dtos/IDataSendMessage";

import { RoomsService } from "../services/RoomsService";
import { MessagesService } from "../services/MessagesService";
import { ConnectionsService } from "../services/ConnectionsService";
import { ILogoutConnection } from "../dtos/ILogoutConnection";

io.on("connection", (socket) => {
  const connectionsServices = ConnectionsService.getInstance();
  const roomsServices = RoomsService.getInstance();
  const messagesServices = MessagesService.getInstance();

  socket.on(
    "select_room",
    async (data: IDataSelectRoom, callback) =>
      await selectRoomSocket(socket, data, callback)
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

  socket.on(
    "logout",
    async ({ userId }: ILogoutConnection) => await logoutSocket({ userId })
  );
});
