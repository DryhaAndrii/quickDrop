import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Room } from './room.entity'
import { RoomDto } from './dto/room.dto'
import { Interval } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'
import { hash } from 'bcrypt'
import { mkdirSync, existsSync } from 'fs'
import { writeFile } from 'fs/promises'
import { join } from 'path'

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

  async updateTokenIssuedAt(roomName: string, nickname: string) {
    const room = await this.roomsRepository.findOne({ where: { roomName } })
    if (!room) throw new UnauthorizedException('Room not found')

    room.users = room.users.map((user) =>
      user.nickname === nickname ? { ...user, tokenIssuedAt: new Date() } : user,
    )

    await this.roomsRepository.save(room)
  }

  async removeUserFromRoom(roomName: string, nickname: string) {
    const room = await this.roomsRepository.findOne({ where: { roomName } })

    if (!room) throw new Error('Room not found')

    room.users = room.users.filter((user) => user.nickname !== nickname)

    if (room.users.length === 0) {
      await this.roomsRepository.remove(room)
    } else {
      await this.roomsRepository.save(room)
    }
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
      throw new Error('Room with this name already exists. Please choose another one.')
    }

    const saltRounds = 10
    const hashedPassword = await hash(roomDto.password, saltRounds)

    const newRoom = this.roomsRepository.create({
      roomName: roomDto.roomName,
      password: hashedPassword,
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

  async saveFiles(roomName: string, files: Express.Multer.File | Express.Multer.File[]) {
    const roomDir = join('uploads', `room_${roomName}`)
    const filesDir = join(roomDir, 'files')

    if (!existsSync(roomDir)) {
      mkdirSync(roomDir)
    }
    if (!existsSync(filesDir)) {
      mkdirSync(filesDir)
    }

    if (!Array.isArray(files)) {
      const filePath = join(filesDir, files.originalname)
      try {
        await writeFile(filePath, files.buffer)
        return [filePath]
      } catch (error) {
        throw new Error(`Error while saving the file: ${error}`)
      }
    }

    // If it's more than one file
    const savedFilePaths = await Promise.all(
      files.map(async (file) => {
        const filePath = join(filesDir, file.originalname)
        try {
          await writeFile(filePath, file.buffer)
          return filePath
        } catch (error) {
          throw new Error(`Error while saving the file: ${error}`)
        }
      }),
    )

    return savedFilePaths
  }

  @Interval(180000) //half hour
  async handleCron() {
    console.log('Cleaning up expired users...')
    await this.removeExpiredUsers()
  }
}
