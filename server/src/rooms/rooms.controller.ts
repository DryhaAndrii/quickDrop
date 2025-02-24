import { Body, Controller, Post } from '@nestjs/common'
import { JoinRoomDto } from './dto/join-room.dto'

@Controller('rooms')
export class RoomsController {
  @Post()
  joinRoom(@Body() body: JoinRoomDto) {
    console.log('Received data:', body)
    return { message: 'User joined the room successfully!', data: body }
  }
}
