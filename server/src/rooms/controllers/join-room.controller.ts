import { Body, Controller, Post, Res, NotFoundException } from '@nestjs/common'
import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { RoomsService } from '@/src/rooms/rooms.service'
import { RoomDto } from '../dto/room.dto'

interface bodyType {
  room: RoomDto
  nickname: string
}

@Controller('rooms')
export class JoinRoomController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly roomsService: RoomsService,
  ) {}

  @Post('join')
  async joinRoom(@Body() body: bodyType, @Res() res: Response) {
    try {
      const { nickname, room } = body

      const existingRoom = await this.roomsService.findByRoomId(room.roomId)
      if (!existingRoom) {
        throw new NotFoundException('Room not found')
      }

      if (existingRoom.password && existingRoom.password !== body.room.password) {
        throw new Error('Incorrect room password')
      }

      const existingUser = await this.roomsService.findUserByNickname(existingRoom.id, nickname)

      if (existingUser) throw new Error('User with this nickname already exists.')

      await this.roomsService.addUserToRoom(existingRoom.id, nickname)

      const token = this.jwtService.sign({
        nickname,
        roomId: existingRoom.id,
      })

      res.cookie('room_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      })

      return res.json({
        message: 'User joined the room successfully!',
        token,
        user: existingUser,
        room: existingRoom,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ message: (err as Error).message })
    }
  }
}
