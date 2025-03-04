import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Room } from './room.entity'
import { RoomDto } from './dto/room.dto'
import { User } from '@/src/users/user.entity'
import { UsersService } from '@/src/users/users.service' // Импортируем сервис пользователей
import { UserDto } from '../users/dto/user.dto'

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    private usersService: UsersService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async findByRoomId(roomId: string): Promise<Room | null> {
    return await this.roomsRepository.findOne({ where: { roomId }, relations: ['users'] })
  }

  async addUserToRoom(roomId: number, userId: number) {
    const room = await this.roomsRepository.findOne({ where: { id: roomId }, relations: ['users'] })
    const user = await this.usersRepository.findOne({ where: { id: userId } })

    if (!room || !user) throw new Error('Room or user not found')

    room.users.push(user)
    await this.roomsRepository.save(room)
  }

  async createRoom(roomDto: RoomDto, userDto: UserDto): Promise<{ room: Room; user: User }> {
    const existingRoom = await this.roomsRepository.findOne({
      where: { roomId: roomDto.roomId },
    })

    if (existingRoom) {
      throw new Error('Room with this ID already exists. Please choose another one.')
    }

    // Создаём комнату
    const newRoom = this.roomsRepository.create({
      roomId: roomDto.roomId,
      password: roomDto.password,
    })
    await this.roomsRepository.save(newRoom)

    // Создаём пользователя
    const existingUser = await this.usersService.findByNickname(userDto.nickname)
    if (existingUser) throw new Error('User with this nickname already exists.')

    const user = await this.usersService.createUser(userDto.nickname)

    // Добавляем пользователя в комнату
    await this.addUserToRoom(newRoom.id, user.id)

    return { room: newRoom, user }
  }
}
