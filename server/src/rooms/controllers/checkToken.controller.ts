import { Controller, UnauthorizedException, Get, Req, Res } from '@nestjs/common'
import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string }
}

@Controller('rooms')
export class CheckTokenController {
  constructor(private readonly jwtService: JwtService) {}

  @Get('checkToken')
  protectedRoute(@Req() req: RequestWithCookies, @Res() res: Response) {
    const token = req.cookies['room_token']
    if (!token) throw new UnauthorizedException('No auth token')

    try {
      const user = this.jwtService.verify<{ userId: string; roomName: string }>(token)

      const newToken = this.jwtService.sign({
        userId: user.userId,
        roomName: user.roomName,
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
