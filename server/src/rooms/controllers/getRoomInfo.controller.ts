import { Controller, Get, Param, Res } from '@nestjs/common'
import { Response } from 'express'
import { UserService } from '../services/user.service'
import { FilesService } from '../services/files.service'
import { MessagesService } from '../services/messages.service'

@Controller('rooms')
export class GetRoomInfoController {
  constructor(
    private readonly usersService: UserService,
    private readonly fileService: FilesService,
    private readonly messagesService: MessagesService,
  ) {}

  @Get(':roomName/roomInfo/:nickname')
  async getRoomFiles(
    @Param('roomName') roomName: string,
    @Param('nickname') nickname: string,
    @Res() res: Response,
  ) {
    const users = await this.usersService.getUsersInRoom(roomName, nickname)

    const files = await this.fileService.getFilesForRoom(roomName)

    const messages = await this.messagesService.getAllMessages(roomName)

    return res.json({ files, users, messages })
  }
}
