import { Controller, Get, Param, Res } from '@nestjs/common'
import { Response } from 'express'
import { RoomsService } from '../rooms.service'

@Controller('rooms')
export class GetRoomFilesController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get(':roomName/files')
  async getRoomFiles(@Param('roomName') roomName: string, @Res() res: Response) {
    const files = await this.roomsService.getFilesForRoom(roomName)
    if (!files || files.length === 0) {
      return res.json({ message: 'No files in this room', files })
    }
    return res.json({ files })
  }
}
