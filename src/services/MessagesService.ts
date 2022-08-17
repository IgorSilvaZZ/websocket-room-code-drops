import { Messages } from "@prisma/client";
import { ICreateMessage } from "../dtos/ICreateMessage";
import { MessagesRepository } from "../repositories/MessagesRepository";

export class MessagesService {
  private messagesRepository: MessagesRepository;

  private static INSTANCE: MessagesService;

  constructor() {
    this.messagesRepository = new MessagesRepository();
  }

  public static getInstance(): MessagesService {
    if (!MessagesService.INSTANCE) {
      MessagesService.INSTANCE = new MessagesService();
    }

    return MessagesService.INSTANCE;
  }

  async create({
    text,
    userSenderId,
    userReceiverId,
    roomId,
  }: ICreateMessage): Promise<Messages> {
    const message = await this.messagesRepository.create({
      text,
      userSenderId,
      userReceiverId,
      roomId,
    });

    return message;
  }

  async listMessagesByRoom(roomId?: string): Promise<Messages[]> {
    const messages = await this.messagesRepository.listMessagesByRoomId(roomId);

    return messages;
  }
}
