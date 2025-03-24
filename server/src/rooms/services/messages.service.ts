import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Room } from '../room.entity'

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  async addMessage(roomName: string, nickname: string, text: string) {
    try {
      const room = await this.roomsRepository.findOne({
        where: { roomName },
      })

      if (!room) {
        throw new Error('Room not found')
      }

      const newMessage = {
        authorNickname: nickname,
        createdAt: new Date(),
        text,
      }

      room.messages.push(newMessage)

      await this.roomsRepository.save(room)
    } catch (error) {
      console.error('Error adding new message:', error)
      throw error
    }
  }

  async getAllMessages(roomName: string) {
    const room = await this.roomsRepository.findOne({ where: { roomName } })
    if (!room) throw new NotFoundException(`Room "${roomName}" not found`)

    return room.messages
  }
}
