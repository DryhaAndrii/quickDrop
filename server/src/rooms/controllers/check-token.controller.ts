import { Controller, UnauthorizedException, Get, Req, Res } from '@nestjs/common'
import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { RoomsService } from '@/src/rooms/rooms.service'

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string }
}

@Controller('rooms')
export class CheckTokenController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly roomsService: RoomsService,
  ) {}

  @Get('checkToken')
  protectedRoute(@Req() req: RequestWithCookies, @Res() res: Response) {
    const token = req.cookies['room_token']
    if (!token) throw new UnauthorizedException('No auth token')

    try {
      const user = this.jwtService.verify<{ userId: string; roomId: string }>(token)

      const newToken = this.jwtService.sign({
        userId: user.userId,
        roomId: user.roomId,
      })

      res.cookie('room_token', newToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      })

      return res.json({ message: 'Token refreshed!', user, newToken })
    } catch {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
