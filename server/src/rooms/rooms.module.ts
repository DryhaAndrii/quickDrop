import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Room } from '@/src/rooms/room.entity'
import { RoomsService } from './services/rooms.service'
import { CreateRoomController } from './controllers/createRoom.controller'
import { JoinRoomController } from './controllers/joinRoom.controller'
import { CheckTokenController } from './controllers/checkToken.controller'
import { ScheduleModule } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'
import { LogoutController } from './controllers/logout.controller'
import { SavesFileController } from './controllers/saveFile.controller'
import { GetRoomFilesController } from './controllers/getRoomFiles.controller'
import { DownloadFileController } from './controllers/downloadFile.controller'
import { CleanupService } from './services/cleanup.service'
import { FilesService } from './services/files.service'
import { UserService } from './services/user.service'
import { TokenService } from './services/token.service'
import { DeleteFileController } from './controllers/deleteFile.controller'
import { GetRoomMemoryLimitsController } from './controllers/getRoomMemoryLimits.controller'
import { InviteController } from './controllers/invite.controller'
import { InviteService } from './services/invite.service'
import { MessagesService } from './services/messages.service'
import { MessagesController } from './controllers/messages.controller'
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default_secret'),
        signOptions: { expiresIn: `${configService.get<number>('JWT_EXPIRATION_TIME')}s` },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Room]),
    ScheduleModule.forRoot(),
  ],
  providers: [
    RoomsService,
    CleanupService,
    FilesService,
    UserService,
    TokenService,
    InviteService,
    MessagesService,
  ],
  controllers: [
    CreateRoomController,
    JoinRoomController,
    CheckTokenController,
    LogoutController,
    SavesFileController,
    GetRoomFilesController,
    DownloadFileController,
    DeleteFileController,
    GetRoomMemoryLimitsController,
    InviteController,
    MessagesController,
  ],
})
export class RoomsModule {}
