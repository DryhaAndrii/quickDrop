import { Body, Controller, Post, Res, Get, Req, UnauthorizedException } from '@nestjs/common'
import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { RoomDto } from './dto/room.dto'

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string }
}

@Controller('rooms')
export class RoomsController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('join')
  joinRoom(@Body() body: RoomDto) {
    return { message: 'User joined the room successfully!', data: body }
  }

  @Post('create')
  createRoom(@Body() body: RoomDto, @Res() res: Response) {
    const token = this.jwtService.sign({
      userId: body.nickName,
      roomId: body.roomId,
    })

    res.cookie('room_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    })

    return res.json({
      message: 'Room created successfully!',
      token,
      data: body,
    })
  }

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
