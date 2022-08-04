import { Connections } from "@prisma/client";
import { ICreateConnection } from "../dtos/ICreateConnection";
import { ConnectionsRepository } from "../repositories/ConnectionsRepository";

export class ConnectionsService {
  private connectionsRepository: ConnectionsRepository;

  constructor() {
    this.connectionsRepository = new ConnectionsRepository();
  }

  async create({
    socket_id,
    userId,
  }: ICreateConnection): Promise<Connections | null> {
    const connectionExists =
      await this.connectionsRepository.findByConnectionUserId(userId);

    if (connectionExists) {
      const { id, socket_id } = connectionExists;

      const connectionUpdate =
        await this.connectionsRepository.updateConnection({ id, socket_id });

      return connectionUpdate;
    } else {
      const connection = await this.connectionsRepository.create({
        socket_id,
        userId,
      });

      return connection;
    }
  }
}
