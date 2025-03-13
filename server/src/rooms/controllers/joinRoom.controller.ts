import { Body, Controller, Post, Res, NotFoundException } from '@nestjs/common'
import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { RoomsService } from '@/src/rooms/services/rooms.service'
import { RoomDto } from '../dto/room.dto'
import * as bcrypt from 'bcrypt'
import { UserService } from '../services/user.service'

interface bodyType {
  room: RoomDto
  nickname: string
}

@Controller('rooms')
export class JoinRoomController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly roomsService: RoomsService,
    private readonly userService: UserService,
  ) {}

  @Post('join')
  async joinRoom(@Body() body: bodyType, @Res() res: Response) {
    try {
      const { nickname, room } = body

      const existingRoom = await this.roomsService.findByRoomName(room.roomName)
      if (!existingRoom) {
        throw new NotFoundException('Room not found')
      }

      if (existingRoom.password) {
        const isPasswordValid = await bcrypt.compare(body.room.password, existingRoom.password)
        if (!isPasswordValid) {
          throw new Error('Incorrect room password')
        }
      }

      const existingUser = await this.userService.findUserByNickname(existingRoom.id, nickname)

      if (existingUser) throw new Error('User with this nickname already exists.')

      await this.userService.addUserToRoom(existingRoom.id, nickname)

      const token = this.jwtService.sign({
        nickname,
        roomName: existingRoom.roomName,
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
