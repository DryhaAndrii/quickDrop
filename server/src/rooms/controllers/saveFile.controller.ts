import {
  Controller,
  UnauthorizedException,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { RoomsService } from '../rooms.service'
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { randomUUID } from 'crypto'
import { unlink } from 'fs/promises'

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string }
}

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100 MB in bytes

@Controller('rooms')
export class SavesFileController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly roomsService: RoomsService,
  ) {}

  @Post('saveFiles')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/tmp',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${randomUUID()}${extname(file.originalname)}`
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
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const token = req.cookies['room_token']
    if (!token) throw new UnauthorizedException('No auth token')
    try {
      const tokenInfo = this.jwtService.verify<{ nickname: string; roomName: string }>(token)
      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' })
      }
      const roomName = tokenInfo.roomName

      const savedFilePaths = await this.roomsService.saveFiles(roomName, files)
      // Удаление временных файлов после обработки
      await Promise.all(files.map((file) => unlink(file.path)))
      return res.json({
        message: 'Files saved successfully!',
        filePaths: savedFilePaths,
      })
    } catch (error) {
      const err = error as Error & { code?: string }

      if (err.code === 'LIMIT_FILE_SIZE') {
        return res
          .status(400)
          .json({ message: `File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.` })
      }

      throw new Error(`Error during saving files: ${error}`)
    }
  }
}
