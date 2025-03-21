import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Room } from '../room.entity'
import { mkdirSync, existsSync, unlinkSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { extname, basename } from 'path'

@Injectable()
export class FilesService {
  private generateUniqueFileName(originalname: string): string {
    const ext = extname(originalname)
    const base = basename(originalname, ext)
    return `${base}_${Date.now()}${ext}`
  }
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  async saveFiles(roomName: string, creator: string, files: Express.Multer.File[]) {
    const room = await this.roomsRepository.findOne({ where: { roomName } })

    if (!room) {
      throw new Error(`Room not found: ${roomName}`)
    }

    const roomDir = join('uploads', `room_${roomName}`)
    const filesDir = join(roomDir, 'files')

    if (!existsSync(roomDir)) {
      try {
        mkdirSync(roomDir, { recursive: true })
      } catch (error) {
        throw new Error(`Failed to create storage directory: ${error}`)
      }
    }
    if (!existsSync(filesDir)) mkdirSync(filesDir)

    const savedFilePaths = await Promise.all(
      files.map(async (file) => {
        const fileBuffer = await readFile(file.path)
        const uniqueFileName = this.generateUniqueFileName(file.originalname)
        const finalPath = join(filesDir, uniqueFileName)
        await writeFile(finalPath, fileBuffer)
        return {
          creator,
          originalName: file.originalname,
          storedName: uniqueFileName,
          path: finalPath,
          uploadedAt: new Date(),
          size: `${file.size}`,
        }
      }),
    )

    room.files = [...room.files, ...savedFilePaths]

    await this.roomsRepository.save(room)

    return savedFilePaths
  }

  async getFilesForRoom(roomName: string) {
    const room = await this.roomsRepository.findOne({ where: { roomName } })
    if (!room) throw new NotFoundException(`Room "${roomName}" not found`)

    return room.files
  }

  async deleteFile(roomName: string, storedName: string) {
    const room = await this.roomsRepository.findOne({ where: { roomName } })

    if (!room) {
      throw new NotFoundException(`Room "${roomName}" not found`)
    }

    // Находим файл в массиве files
    const fileIndex = room.files.findIndex((file) => file.storedName === storedName)

    if (fileIndex === -1) {
      throw new NotFoundException(`File "${storedName}" not found in room "${roomName}"`)
    }

    // Удаляем файл из файловой системы
    const filePath = join('uploads', `room_${roomName}`, 'files', storedName)

    if (existsSync(filePath)) {
      unlinkSync(filePath) // Удаляем файл
    } else {
      throw new NotFoundException(`File "${storedName}" not found in filesystem`)
    }

    // Удаляем файл из массива files в комнате
    room.files.splice(fileIndex, 1)

    // Сохраняем обновленную комнату в базе данных
    await this.roomsRepository.save(room)

    return { message: `File "${storedName}" deleted successfully` }
  }
}
