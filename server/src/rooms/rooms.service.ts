// src/rooms/rooms.service.ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Room } from './room.entity'

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  async createRoom(name: string, owner: string): Promise<Room> {
    const room = this.roomsRepository.create({ name, owner })
    return await this.roomsRepository.save(room)
  }
}
