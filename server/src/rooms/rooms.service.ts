import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Room } from './room.entity'
import { RoomDto } from './dto/room.dto'
import { Interval } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    private configService: ConfigService,
  ) {}

  async findByRoomName(roomName: string): Promise<Room | null> {
    return await this.roomsRepository.findOne({ where: { roomName } })
  }

  async findUserByNickname(id: number, nickname: string): Promise<Room | null> {
    const room = await this.roomsRepository.findOne({ where: { id } })

    if (room) {
      const user = room.users.find((user) => user.nickname === nickname)

      if (user) {
        return room
      }
    }

    return null
  }

  async addUserToRoom(id: number, nickname: string) {
    const room = await this.roomsRepository.findOne({ where: { id } })

    if (!room) throw new Error('Room not found')

    const tokenIssuedAt = new Date()

    room.users.push({ nickname, tokenIssuedAt })
    await this.roomsRepository.save(room)
  }

  async createRoom(roomDto: RoomDto, nickname: string): Promise<{ room: Room }> {
    const existingRoom = await this.roomsRepository.findOne({
      where: { roomName: roomDto.roomName },
    })
    if (existingRoom) {
      throw new Error('Room with this ID already exists. Please choose another one.')
    }
    const newRoom = this.roomsRepository.create({
      roomName: roomDto.roomName,
      password: roomDto.password,
    })
    await this.roomsRepository.save(newRoom)
    await this.addUserToRoom(newRoom.id, nickname)
    return { room: newRoom }
  }

  async removeExpiredUsers() {
    const rooms = await this.roomsRepository.find()

    const currentTime = new Date().getTime()

    for (const room of rooms) {
      room.users = room.users.filter((user) => {
        const tokenAge = (currentTime - new Date(user.tokenIssuedAt).getTime()) / 1000
        const tokenExpirationTime = Number(
          this.configService.get<string>('JWT_EXPIRATION_TIME') ?? 5,
        )

        return tokenAge < tokenExpirationTime
      })

      if (room.users.length > 0) {
        await this.roomsRepository.save(room)
      } else {
        await this.roomsRepository.remove(room)
      }
    }
  }

  @Interval(180000) //half hour
  async handleCron() {
    console.log('Cleaning up expired users...')
    await this.removeExpiredUsers()
  }
}
