import {
  Controller,
  Post,
  Res,
  UnauthorizedException,
  Req,
  NotFoundException,
  BadRequestException,
  Get,
  Param,
} from '@nestjs/common'
import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { InviteService } from '../services/invite.service'
import { RoomsService } from '../services/rooms.service'

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string }
}

@Controller('rooms')
export class InviteController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly inviteService: InviteService,
    private readonly roomsService: RoomsService,
  ) {}

  @Post('createInvite')
  async createInvite(@Req() req: RequestWithCookies, @Res() res: Response) {
    const token = req.cookies['room_token']
    if (!token) throw new UnauthorizedException('No auth token')
    try {
      const { roomName, password } = this.jwtService.verify<{
        roomName: string
        password: string
      }>(token)

      const room = await this.roomsService.findByRoomName(roomName)
      if (!room) throw new NotFoundException('Room not found')

      if (room.password !== password) throw new BadRequestException('Incorrect room password')

      const inviteId = this.inviteService.createInvite(roomName, password)

      return res.json({
        message: 'Invite created successfully!',
        inviteId,
      })
    } catch (err) {
      console.log('Error creating invite:', err)
      return res.status(500).json({ message: (err as Error).message })
    }
  }

  @Get('rooms/exchangeInviteId/:inviteId/:nickname')
  exchangeInvite(
    @Param('inviteId') inviteId: string,
    @Param('nickname') nickname: string,
    @Req() req: RequestWithCookies,
    @Res() res: Response,
  ) {
    try {
      console.log(inviteId)

      const { password, roomName } = this.inviteService.exchangeInviteIdToToken(inviteId)

      console.log('exchangeResult:', password, roomName)

      return res.json({
        message: 'Invite exchanged successfully!',
        inviteId,
      })
    } catch (err) {
      console.log('Error exchanging invite:', err)
      return res.status(500).json({ message: (err as Error).message })
    }
  }
}
