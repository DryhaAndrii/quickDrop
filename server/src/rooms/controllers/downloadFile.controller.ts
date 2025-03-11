import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common'
import { Response } from 'express'
import { RoomsService } from '../rooms.service'
import { join } from 'path'
import { promises as fs } from 'fs'

@Controller('rooms')
export class DownloadFileController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get(':roomName/download/:fileName')
  async downloadFile(
    @Param('roomName') roomName: string,
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    const files = await this.roomsService.getFilesForRoom(roomName)

    if (!files || files.length === 0) {
      throw new NotFoundException('No files found in this room')
    }

    const file = files.find((f) => f.storedName === fileName)
    if (!file) {
      throw new NotFoundException('File not found in this room')
    }

    const filePath = join(process.cwd(), 'uploads', `room_${roomName}`, 'files', fileName)
    console.log('Path:', filePath)

    try {
      await fs.access(filePath)
    } catch {
      throw new NotFoundException('File does not exist on the server')
    }

    res.download(filePath, fileName, (err) => {
      if (err) {
        throw new NotFoundException('Error downloading file')
      }
    })
  }
}
