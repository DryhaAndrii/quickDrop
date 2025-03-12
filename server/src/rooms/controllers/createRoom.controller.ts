import { Body, Controller, Post, Res } from '@nestjs/common'
import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { RoomsService } from '@/src/rooms/rooms.service'
import { RoomDto } from '@/src/rooms/dto/room.dto'
import { BadRequestException } from '@nestjs/common'

@Controller('rooms')
export class CreateRoomController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly roomsService: RoomsService,
  ) {}

  @Post('create')
  async createRoom(
    @Body('room') room: RoomDto,
    @Body('nickname') nickname: string,
    @Res() res: Response,
  ) {
    try {
      if (!nickname || nickname.trim().length === 0) {
        throw new BadRequestException('Nickname is required')
      }

      const { room: newRoom } = await this.roomsService.createRoom(room, nickname)
      const token = this.jwtService.sign({
        nickname: nickname,
        roomName: newRoom.roomName,
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
        nickname,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ message: (err as Error).message })
    }
  }
}
