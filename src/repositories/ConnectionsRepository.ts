import { Connections } from "@prisma/client";
import { client } from "../database/client";

import { ICreateConnection } from "../dtos/ICreateConnection";
import { IUpdateConnection } from "../dtos/IUpdateConnection";

export class ConnectionsRepository {
  async create({ socketId, userId }: ICreateConnection): Promise<Connections> {
    const connection = await client.connections.create({
      data: { socket_id: socketId, userId },
    });

    return connection;
  }

  async findByConnectionUserId(userId?: string): Promise<Connections | null> {
    const connection = await client.connections.findFirst({
      where: { userId },
    });

    return connection;
  }

  async updateConnection({
    id,
    socket_id,
  }: IUpdateConnection): Promise<Connections> {
    const connection = await client.connections.update({
      where: {
        id,
      },
      data: {
        socket_id,
      },
    });

    return connection;
  }
}
