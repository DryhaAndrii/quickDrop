import { Controller, UnauthorizedException, Get, Req } from '@nestjs/common'
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
  protectedRoute(@Req() req: RequestWithCookies) {
    const token = req.cookies['room_token']
    if (!token) throw new UnauthorizedException('No auth token')

    try {
      const user = this.jwtService.verify<{ userId: string; roomId: string }>(token)

      return { message: 'Authenticated!', user }
    } catch {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
