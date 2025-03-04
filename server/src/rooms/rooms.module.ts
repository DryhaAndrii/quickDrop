import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Room } from '@/src/rooms/room.entity'
import { User } from '@/src/users/user.entity'
import { RoomsService } from './rooms.service'
import { CreateRoomController } from './controllers/create-room.controller'
import { JoinRoomController } from './controllers/join-room.controller'
import { CheckTokenController } from './controllers/check-token.controller'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([Room, User]),
    UsersModule,
  ],
  providers: [RoomsService],
  controllers: [CreateRoomController, JoinRoomController, CheckTokenController],
})
export class RoomsModule {}
