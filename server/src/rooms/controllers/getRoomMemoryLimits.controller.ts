import { Controller, Get, Res } from '@nestjs/common'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'

@Controller('rooms')
export class GetRoomMemoryLimitsController {
  constructor(private readonly configService: ConfigService) {}

  @Get('getRoomMemoryLimits')
  getRoomLimits(@Res() res: Response) {
    try {
      const maxFilesSize = this.configService.get<number>('MAX_FILES_SIZE') ?? 15
      const maxRoomSize = this.configService.get<number>('MAX_ROOM_SIZE') ?? 100

      return res.json({
        maxFilesSize,
        maxRoomSize,
      })
    } catch (error) {
      console.log('GetRoomMemoryLimits error:', error)
      return res.status(500).json({ message: 'An error occurred while retrieving memory limits' })
    }
  }
}
