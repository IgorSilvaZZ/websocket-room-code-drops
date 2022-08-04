import { Users } from "@prisma/client";

import { client } from "../database/client";

export class UsersRepository {
  async create(username: string): Promise<Users> {
    const user = await client.users.create({
      data: {
        username,
      },
    });

    return user;
  }

  async findByName(username: string): Promise<Users | null> {
    const user = await client.users.findFirst({
      where: {
        username,
      },
    });

    return user;
  }
}
