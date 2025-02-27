import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { RoomsController } from './rooms.controller'

@Module({
  imports: [JwtModule],
  controllers: [RoomsController],
})
export class RoomsModule {}
