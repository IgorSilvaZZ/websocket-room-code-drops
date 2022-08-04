import { Messages } from "@prisma/client";
import { client } from "../database/client";
import { ICreateMessage } from "../dtos/ICreateMessage";

export class MessagesRepository {
  async create({
    text,
    userSenderId,
    roomId,
    userReceiverId,
  }: ICreateMessage): Promise<Messages> {
    const message = await client.messages.create({
      data: {
        text,
        userSenderId,
        userReceiverId,
        roomId,
      },
    });

    return message;
  }

  async listMessagesByRoomId(roomId: string): Promise<Messages[]> {
    const messages = await client.messages.findMany({
      where: {
        roomId,
      },
    });

    return messages;
  }
}
