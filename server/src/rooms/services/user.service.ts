import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Room } from '../room.entity'
import { rm } from 'fs/promises'
import { join } from 'path'
import { MessagesService } from './messages.service'

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    private messagesService: MessagesService,
  ) {}
  onModuleInit() {
    setInterval(() => {
      void this.checkAFKUsers()
    }, 30000) //30 seconds
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
      await this.messagesService.addMessage(roomName, 'System', `${nickname} has left the room`)
    }
  }

  async addUserToRoom(id: number, nickname: string) {
    const room = await this.roomsRepository.findOne({ where: { id } })

    if (!room) throw new Error('Room not found')

    const tokenIssuedAt = new Date()

    room.users.push({ nickname, tokenIssuedAt, afk: false, lastAfkCheck: new Date() })
    await this.roomsRepository.save(room)
    await this.messagesService.addMessage(room.roomName, 'System', `${nickname} entered the room`)
  }
  async getUsersInRoom(
    roomName: string,
    nickname: string,
  ): Promise<{ nickname: string; afk: boolean }[]> {
    const room = await this.roomsRepository.findOne({ where: { roomName } })

    if (!room) {
      throw new Error('Room not found')
    }

    const user = room.users.find((user) => user.nickname === nickname)

    if (user) {
      user.lastAfkCheck = new Date() // Обновляем время последнего запроса
      user.afk = false // Сбрасываем AFK
    }

    await this.roomsRepository.save(room) // Сохраняем изменения в БД

    return room.users
  }
  async checkAFKUsers() {
    const rooms = await this.roomsRepository.find()
    const now = new Date()

    for (const room of rooms) {
      let updated = false

      for (const user of room.users) {
        if (!user.afk && now.getTime() - new Date(user.lastAfkCheck).getTime() > 10000) {
          user.afk = true // Если прошло 10 секунд без запроса — ставим AFK
          updated = true
        }
      }

      if (updated) await this.roomsRepository.save(room)
    }
  }
}
