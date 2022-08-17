import { Users } from "@prisma/client";
import { UsersRepository } from "../repositories/UsersRepository";

export class UsersServices {
  private usersRepository: UsersRepository;

  private static INSTANCE: UsersServices;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  public static getInstance(): UsersServices {
    if (!UsersServices.INSTANCE) {
      UsersServices.INSTANCE = new UsersServices();
    }

    return UsersServices.INSTANCE;
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
