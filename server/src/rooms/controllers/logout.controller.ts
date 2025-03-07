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

      await this.roomsService.removeUserFromRoom(user.roomName, user.nickname)

      res.clearCookie('room_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      })

      return res.json({ message: 'User logged out successfully!' })
    } catch {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
