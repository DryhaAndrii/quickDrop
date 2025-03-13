import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Room } from '../room.entity'
import { rm } from 'fs/promises'
import { join } from 'path'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

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

  async removeUserFromRoom(roomName: string, nickname: string) {
    const room = await this.roomsRepository.findOne({ where: { roomName } })
    if (!room) throw new Error('Room not found')

    room.users = room.users.filter((user) => user.nickname !== nickname)

    if (room.users.length === 0) {
      try {
        await this.roomsRepository.remove(room)

        const roomDir = room.storagePath || join('uploads', `room_${roomName}`)

        await rm(roomDir, {
          recursive: true,
          force: true,
          maxRetries: 3,
          retryDelay: 1000,
        })
      } catch (error) {
        console.error(`Failed to delete files:`, error)
        throw error
      }
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
}
