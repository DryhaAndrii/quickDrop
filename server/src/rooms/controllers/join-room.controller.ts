import { Body, Controller, Post } from '@nestjs/common'
import { RoomDto } from '@/src/rooms/dto/room.dto'
import { UserDto } from '../dto/user.dto'

interface bodyType {
  room: RoomDto
  user: UserDto
}

@Controller('rooms')
export class JoinRoomController {
  @Post('join')
  joinRoom(@Body() body: bodyType) {
    return { message: 'User joined the room successfully!', data: body }
  }
}
