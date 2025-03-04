import { Body, Controller, Post, Res } from '@nestjs/common'
import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { RoomsService } from '@/src/rooms/rooms.service'
import { RoomDto } from '@/src/rooms/dto/room.dto'

interface bodyType {
  room: RoomDto
  user: { nickname: string }
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
    try {
      const { user, room } = body

      // Создаём комнату и пользователя
      const { room: newRoom, user: newUser } = await this.roomsService.createRoom(room, user)

      const token = this.jwtService.sign({
        userId: newUser.nickname,
        roomId: newRoom.roomId,
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
        room: newRoom,
        user: newUser,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ message: (err as Error).message })
    }
  }
}
