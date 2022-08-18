import { io } from "../http";

import selectRoomSocket from "./events/SelectRoomSocket";
import logoutSocket from "./events/LogoutSocket";

import { IDataSelectRoom } from "../dtos/IDataSelectRoom";
import { IDataSendMessage } from "../dtos/IDataSendMessage";

import { RoomsService } from "../services/RoomsService";
import { MessagesService } from "../services/MessagesService";
import { ConnectionsService } from "../services/ConnectionsService";
import { ILogoutConnection } from "../dtos/ILogoutConnection";
import sendMessageSocket from "./events/SendMessageSocket";

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
    async (data: IDataSendMessage) => await sendMessageSocket(data)
  );

  socket.on(
    "logout",
    async ({ userId }: ILogoutConnection) => await logoutSocket({ userId })
  );
});
