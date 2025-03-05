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
  async findByRoomId(roomId: string): Promise<Room | null> {
    return await this.roomsRepository.findOne({ where: { roomId } })
  }

  async findUserByNickname(roomId: number, nickname: string): Promise<Room | null> {
    const room = await this.roomsRepository.findOne({ where: { id: roomId } })

    if (room && room.users.includes(nickname)) {
      return room
    }

    return null
  }

  async addUserToRoom(roomId: number, nickname: string) {
    const room = await this.roomsRepository.findOne({ where: { id: roomId } })

    if (!room) throw new Error('Room not found')

    room.users.push(nickname)
    await this.roomsRepository.save(room)
  }

  async createRoom(roomDto: RoomDto, nickname: string): Promise<{ room: Room }> {
    const existingRoom = await this.roomsRepository.findOne({
      where: { roomId: roomDto.roomId },
    })

    if (existingRoom) {
      throw new Error('Room with this ID already exists. Please choose another one.')
    }

    // Создаём комнату
    const newRoom = this.roomsRepository.create({
      roomId: roomDto.roomId,
      password: roomDto.password,
    })
    await this.roomsRepository.save(newRoom)

    // Добавляем пользователя в комнату
    await this.addUserToRoom(newRoom.id, nickname)

    return { room: newRoom }
  }
}
