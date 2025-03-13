import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Room } from '../room.entity'
import { Interval } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'
import { rm } from 'fs/promises'
import { join } from 'path'

@Injectable()
export class RemovingExpiredUsersAndRoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    private configService: ConfigService,
  ) {}

  async removeExpiredUsers() {
    const rooms = await this.roomsRepository.find()
    const currentTime = new Date().getTime()

    for (const room of rooms) {
      const initialUserCount = room.users.length

      // Filtering expired users
      room.users = room.users.filter((user) => {
        const tokenAge = (currentTime - new Date(user.tokenIssuedAt).getTime()) / 1000
        const tokenExpirationTime = Number(
          this.configService.get<string>('JWT_EXPIRATION_TIME') ?? 5,
        )
        return tokenAge < tokenExpirationTime
      })

      if (room.users.length > 0) {
        if (room.users.length !== initialUserCount) {
          await this.roomsRepository.save(room)
        }
      } else {
        // Deleting room and files
        await this.roomsRepository.remove(room)

        try {
          const roomDir = join('uploads', `room_${room.roomName}`)
          await rm(roomDir, {
            recursive: true,
            force: true,
            maxRetries: 3,
            retryDelay: 1000,
          })
          console.log(`Deleted room directory: ${roomDir}`)
        } catch (error) {
          console.error(`Failed to delete files for room ${room.roomName}:`, error)
        }
      }
    }
  }

  @Interval(60000) //half hour
  async handleCron() {
    console.log('Cleaning up expired users...')
    await this.removeExpiredUsers()
  }
}
