import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Room } from '../room.entity'
import { hash } from 'bcrypt'
import { join } from 'path'
import { RoomDto } from '../dto/room.dto'
import { UserService } from './user.service'

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    private userService: UserService,
  ) {}

  async findByRoomName(roomName: string): Promise<Room | null> {
    return await this.roomsRepository.findOne({ where: { roomName } })
  }

  async createRoom(roomDto: RoomDto, nickname: string): Promise<{ room: Room }> {
    const existingRoom = await this.roomsRepository.findOne({
      where: { roomName: roomDto.roomName },
    })
    if (existingRoom) {
      throw new Error('Room with this name already exists. Please choose another one.')
    }

    const saltRounds = 10
    const hashedPassword = await hash(roomDto.password, saltRounds)

    const newRoom = this.roomsRepository.create({
      roomName: roomDto.roomName,
      password: hashedPassword,
    })
    newRoom.storagePath = join('uploads', `room_${newRoom.roomName}`)
    await this.roomsRepository.save(newRoom)
    await this.userService.addUserToRoom(newRoom.id, nickname)
    return { room: newRoom }
  }
}
