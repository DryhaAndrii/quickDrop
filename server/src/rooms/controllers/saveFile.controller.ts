import {
  Controller,
  UnauthorizedException,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { RoomsService } from '../rooms.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string }
}

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100 MB in bytes

@Controller('rooms')
export class SaveFileController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly roomsService: RoomsService,
  ) {}

  @Post('saveFile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + extname(file.originalname)
          callback(null, file.fieldname + '-' + uniqueSuffix)
        },
      }),

      limits: {
        fileSize: MAX_FILE_SIZE,
      },
    }),
  )
  async saveFile(
    @Req() req: RequestWithCookies,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const token = req.cookies['room_token']
    if (!token) throw new UnauthorizedException('No auth token')
    try {
      const tokenInfo = this.jwtService.verify<{ nickname: string; roomName: string }>(token)
      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' })
      }

      const roomName = tokenInfo.roomName
      const savedFilePath = await this.roomsService.saveFile(roomName, file)

      return res.json({ message: 'File saved successfully!', filePath: savedFilePath })
    } catch (error) {
      const err = error as Error & { code?: string }

      if (err.code === 'LIMIT_FILE_SIZE') {
        return res
          .status(400)
          .json({ message: `File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.` })
      }

      throw new Error(`Error during saving file: ${err.message}`)
    }
  }
}
