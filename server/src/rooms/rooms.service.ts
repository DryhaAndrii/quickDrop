// src/rooms/rooms.service.ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Room } from './room.entity'
import { RoomDto } from './dto/room.dto'

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  async createRoom(room: RoomDto): Promise<Room> {
    const existingRoom = await this.roomsRepository.findOne({
      where: { roomId: room.roomId },
    })

    if (existingRoom) {
      throw new Error('Room with this ID already exists. Please choose another one.')
    }

    const newRoom = this.roomsRepository.create({
      roomId: room.roomId,
      password: room.password,
    })

    return await this.roomsRepository.save(newRoom)
  }
}
