import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { RoomsController } from './rooms.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Room } from '@/src/rooms/room.entity'
import { User } from '@/src/users/user.entity'
import { RoomsService } from './rooms.service'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([Room, User]),
  ],
  providers: [RoomsService],
  controllers: [RoomsController],
})
export class RoomsModule {}
