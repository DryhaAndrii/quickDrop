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
import { ConfigService } from '@nestjs/config'
import { UserService } from '../services/user.service'

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string }
}

@Controller('rooms')
export class InviteController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly inviteService: InviteService,
    private readonly roomsService: RoomsService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
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

  @Get('exchangeInviteId/:inviteId/:nickname')
  async exchangeInvite(
    @Param('inviteId') inviteId: string,
    @Param('nickname') nickname: string,
    @Req() req: RequestWithCookies,
    @Res() res: Response,
  ) {
    try {
      const { password, roomName } = this.inviteService.exchangeInviteIdToToken(inviteId)

      const existingRoom = await this.roomsService.findByRoomName(roomName)
      if (!existingRoom) {
        throw new NotFoundException('Room not found')
      }

      const existingUser = await this.userService.findUserByNickname(existingRoom.id, nickname)

      if (existingUser) throw new Error('User with this nickname already exists.')

      await this.userService.addUserToRoom(existingRoom.id, nickname)

      const maxFilesSize = this.configService.get<number>('MAX_FILES_SIZE') ?? 15

      const maxRoomSize = this.configService.get<number>('MAX_ROOM_SIZE') ?? 100

      const roomMemory = {
        maxFilesSize,
        maxRoomSize,
      }

      const token = this.jwtService.sign({
        nickname,
        roomName: roomName,
        password: password,
      })

      res.cookie('room_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      })

      return res.json({
        message: 'Joined the room successfully!',
        token,
        nickname,
        room: existingRoom,
        roomMemory,
      })
    } catch (err) {
      console.log('Error exchanging invite:', err)
      if ((err as Error).message === 'Room not found')
        return res
          .status(404)
          .json({ message: 'The room you were invited to has already been deleted.' })
      return res.status(500).json({ message: (err as Error).message })
    }
  }
}
