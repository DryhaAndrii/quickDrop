import { Controller, Get, Param, Res } from '@nestjs/common'
import { Response } from 'express'
import { FilesService } from '../services/files.service'

@Controller('rooms')
export class GetRoomFilesController {
  constructor(private readonly fileService: FilesService) {}

  @Get(':roomName/files')
  async getRoomFiles(@Param('roomName') roomName: string, @Res() res: Response) {
    const files = await this.fileService.getFilesForRoom(roomName)
    if (!files || files.length === 0) {
      return res.json({ message: 'No files in this room', files })
    }
    return res.json({ files })
  }
}
