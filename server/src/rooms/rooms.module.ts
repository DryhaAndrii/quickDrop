import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { RoomsController } from './rooms.controller'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [RoomsController],
})
export class RoomsModule {}
