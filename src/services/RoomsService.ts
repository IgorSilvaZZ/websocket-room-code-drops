import { Rooms } from "@prisma/client";
import { RoomsRepository } from "../repositories/RoomsRepository";

export class RoomsService {
  private roomsRepository: RoomsRepository;

  constructor() {
    this.roomsRepository = new RoomsRepository();
  }

  async create(name: string): Promise<Rooms> {
    const roomExists = await this.roomsRepository.findByName(name);

    if (roomExists) {
      return roomExists;
    } else {
      const room = await this.roomsRepository.create(name);

      return room;
    }
  }
}
