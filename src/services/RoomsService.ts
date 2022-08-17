import { Rooms } from "@prisma/client";
import { RoomsRepository } from "../repositories/RoomsRepository";

export class RoomsService {
  private roomsRepository: RoomsRepository;

  private static INSTANCE: RoomsService;

  constructor() {
    this.roomsRepository = new RoomsRepository();
  }

  public static getInstance(): RoomsService {
    if (!RoomsService.INSTANCE) {
      RoomsService.INSTANCE = new RoomsService();
    }

    return RoomsService.INSTANCE;
  }

  async create(name: string): Promise<Rooms> {
    const room = await this.roomsRepository.create(name);

    return room;
  }

  async findByNameRoom(name: string): Promise<Rooms | null> {
    const room = await this.roomsRepository.findByName(name);

    return room;
  }
}
