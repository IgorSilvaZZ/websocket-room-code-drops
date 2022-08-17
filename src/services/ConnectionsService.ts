import { Connections } from "@prisma/client";
import { ICreateConnection } from "../dtos/ICreateConnection";
import { ConnectionsRepository } from "../repositories/ConnectionsRepository";

export class ConnectionsService {
  private connectionsRepository: ConnectionsRepository;

  constructor() {
    this.connectionsRepository = new ConnectionsRepository();
  }

  async create({
    socketId,
    userId,
  }: ICreateConnection): Promise<Connections | null> {
    const connection = await this.connectionsRepository.create({
      socketId,
      userId,
    });

    return connection;
  }

  async updateSocketId(id: string, socket_id: string): Promise<Connections> {
    const connection = await this.connectionsRepository.updateConnection({
      id,
      socket_id,
    });

    return connection;
  }

  async findConnectionUser(user_id: string): Promise<Connections | null> {
    const connection = await this.connectionsRepository.findByConnectionUserId(
      user_id
    );

    return connection;
  }
}
