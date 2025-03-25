import { Controller, Get, Param, Res } from '@nestjs/common'
import { Response } from 'express'
import { UserService } from '../services/user.service'

@Controller('rooms')
export class GetAllUsersController {
  constructor(private readonly usersService: UserService) {}

  @Get(':roomName/getAllUsers/:nickname')
  async getRoomFiles(
    @Param('roomName') roomName: string,
    @Param('nickname') nickname: string,
    @Res() res: Response,
  ) {
    const users = await this.usersService.getUsersInRoom(roomName, nickname)

    return res.json({ users })
  }
}
