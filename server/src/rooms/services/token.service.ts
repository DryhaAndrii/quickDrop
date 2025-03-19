import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Room } from '../room.entity'

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  async updateTokenIssuedAt(roomName: string, nickname: string, password: string) {
    const room = await this.roomsRepository.findOne({ where: { roomName, password } })
    if (!room) throw new UnauthorizedException('Room not found or password is incorrect')

    room.users = room.users.map((user) =>
      user.nickname === nickname ? { ...user, tokenIssuedAt: new Date() } : user,
    )

    await this.roomsRepository.save(room)
  }
}
