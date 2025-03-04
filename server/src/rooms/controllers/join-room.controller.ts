import { Body, Controller, Post, Res, NotFoundException } from '@nestjs/common'
import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { RoomsService } from '@/src/rooms/rooms.service'
import { UsersService } from '@/src/users/users.service'
import { RoomDto } from '@/src/rooms/dto/room.dto'
import { UserDto } from '@/src/users/dto/user.dto'

interface bodyType {
  room: RoomDto
  user: UserDto
}

@Controller('rooms')
export class JoinRoomController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly roomsService: RoomsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('join')
  async joinRoom(@Body() body: bodyType, @Res() res: Response) {
    try {
      const { user, room } = body

      // 2️⃣ Ищем комнату
      const existingRoom = await this.roomsService.findByRoomId(room.roomId)
      if (!existingRoom) {
        throw new NotFoundException('Room not found')
      }

      if (existingRoom.password && existingRoom.password !== body.room.password) {
        throw new Error('Incorrect room password')
      }

      // 1️⃣ Ищем пользователя, если нет — создаем
      let existingUser = await this.usersService.findByNickname(user.nickname)

      if (existingUser) throw new Error('User with this nickname already exists.')

      existingUser = await this.usersService.createUser(user.nickname)

      // 3️⃣ Добавляем пользователя в комнату
      await this.roomsService.addUserToRoom(existingRoom.id, existingUser.id)

      // 4️⃣ Создаем JWT токен
      const token = this.jwtService.sign({
        userId: existingUser.id,
        roomId: existingRoom.id,
      })

      // 5️⃣ Устанавливаем куку с токеном
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
