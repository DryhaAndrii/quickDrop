import { Body, Controller, Post, Res } from '@nestjs/common'
import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { RoomsService } from '@/src/rooms/rooms.service'
import { RoomDto } from '@/src/rooms/dto/room.dto'
import { UserDto } from '../dto/user.dto'

interface bodyType {
  room: RoomDto
  user: UserDto
}

@Controller('rooms')
export class CreateRoomController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly roomsService: RoomsService,
  ) {}

  @Post('create')
  async createRoom(@Body() body: bodyType, @Res() res: Response) {
    console.log('BODY:', body)
    const { user, room } = body
    const token = this.jwtService.sign({
      userId: user.nickname,
      roomId: room.roomId,
    })

    const newRoom = await this.roomsService.createRoom(room)

    res.cookie('room_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    })

    return res.json({
      message: 'Room created successfully!',
      token,
      room: newRoom,
    })
  }
}
