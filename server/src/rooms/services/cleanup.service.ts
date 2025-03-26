import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Room } from '../room.entity'
import { Interval } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'
import { rm, readdir, stat } from 'fs/promises'
import { join } from 'path'
import { UserService } from './user.service'

const MAX_FILE_AGE = 60 * 10 * 1000 //10 minute
const INTERVAL = 60 * 30 * 1000 //30 minute
//const INTERVAL = 30 * 1 * 1000 //30 sec

@Injectable()
export class CleanupService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async removeExpiredUsersAndRooms() {
    const rooms = await this.roomsRepository.find()
    const currentTime = new Date().getTime()

    for (const room of rooms) {
      for (const user of [...room.users]) {
        const tokenAge = (currentTime - new Date(user.tokenIssuedAt).getTime()) / 1000
        const tokenExpirationTime = Number(
          this.configService.get<string>('JWT_EXPIRATION_TIME') ?? 5,
        )

        if (tokenAge >= tokenExpirationTime) {
          await this.userService.removeUserFromRoom(room.roomName, user.nickname)
        }
      }
    }
  }

  async cleanTmpDirectory() {
    const tmpDir = join('uploads', 'tmp')
    const currentTime = Date.now()

    try {
      const files = await readdir(tmpDir)

      for (const file of files) {
        const filePath = join(tmpDir, file)
        const fileStats = await stat(filePath)

        if (currentTime - fileStats.mtimeMs > MAX_FILE_AGE) {
          await rm(filePath, { force: true })
          console.log(`Deleted temporary file: ${filePath}`)
        }
      }
    } catch (error) {
      console.error('Error cleaning tmp directory:', error)
    }
  }

  @Interval(INTERVAL)
  async handleCron() {
    console.log('Cleaning up expired users and rooms...')
    await this.removeExpiredUsersAndRooms()

    console.log('Cleaning up temporary files...')
    await this.cleanTmpDirectory()
  }
}
