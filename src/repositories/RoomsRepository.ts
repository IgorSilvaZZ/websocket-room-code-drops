import { Rooms } from "@prisma/client";
import { client } from "../database/client";

export class RoomsRepository {
  async create(name: string): Promise<Rooms> {
    const room = await client.rooms.create({
      data: {
        name,
      },
    });

    return room;
  }

  async findByName(name: string): Promise<Rooms | null> {
    const room = await client.rooms.findFirst({
      where: {
        name,
      },
    });

    return room;
  }
}
