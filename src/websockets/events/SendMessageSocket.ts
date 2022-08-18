import { io } from "../../http";

import { MessagesService } from "../../services/MessagesService";
import { RoomsService } from "../../services/RoomsService";

import { IDataSendMessage } from "../../dtos/IDataSendMessage";

export default async ({ room, text, userSenderId }: IDataSendMessage) => {
  const roomsServices = RoomsService.getInstance();
  const messagesServices = MessagesService.getInstance();

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
};
