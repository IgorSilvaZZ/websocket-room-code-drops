import { Users } from "@prisma/client";
import { UsersRepository } from "../repositories/UsersRepository";

export class UsersServices {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async create(username: string): Promise<Users | null> {
    const user = await this.usersRepository.create(username);

    return user;
  }

  async findByUsername(username: string): Promise<Users | null> {
    const user = await this.usersRepository.findByName(username);

    return user;
  }
}
