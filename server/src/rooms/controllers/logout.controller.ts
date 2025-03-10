import { Controller, UnauthorizedException, Get, Req, Res } from '@nestjs/common'
import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { RoomsService } from '../rooms.service'

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string }
}

@Controller('rooms')
export class LogoutController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly roomsService: RoomsService,
  ) {}

  @Get('logout')
  async logout(@Req() req: RequestWithCookies, @Res() res: Response) {
    const token = req.cookies['room_token']
    if (!token) throw new UnauthorizedException('No auth token')

    try {
      const user = this.jwtService.verify<{ nickname: string; roomName: string }>(token)
      const room = await this.roomsService.findByRoomName(user.roomName)

      await this.roomsService.removeUserFromRoom(user.roomName, user.nickname)

      if (room && room.users.length === 1) {
        const updatedRoom = await this.roomsService.findByRoomName(user.roomName)
        if (!updatedRoom) {
          console.log(`Room ${user.roomName} was deleted during logout`)
        }
      }

      res.clearCookie('room_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      })

      return res.json({ message: 'User logged out successfully!' })
    } catch (error) {
      console.error('Logout error:', error)
      throw new UnauthorizedException('Invalid token')
    }
  }
}
