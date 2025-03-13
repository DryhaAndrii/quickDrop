import {
  Controller,
  UnauthorizedException,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
  Body,
} from '@nestjs/common'
import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { RoomsService } from '../services/rooms.service'
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { randomUUID } from 'crypto'
import { unlink, access, mkdir } from 'fs/promises'
import { promises } from 'fs'
import * as path from 'path'
import { FilesService } from '../services/files.service'

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string }
}

interface SaveFilesBody {
  smallApi: string
  files: Express.Multer.File[]
}

const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500 MB in bytes
const SMALL_API_FILE_SIZE = 5 * 1024 * 1024 // 5 MB in bytes

const BIG_API_MAX_SIZE = 1 * 1024 * 1024 * 1024 // 1 GB in bytes
const SMALL_API_MAX_SIZE = 15 * 1024 * 1024 // 15 MB in bytes

@Controller('rooms')
export class SavesFileController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly roomsService: RoomsService,
    private readonly fileService: FilesService,
  ) {}

  async getFolderSize(folderPath: string): Promise<number> {
    const files = await promises.readdir(folderPath)
    let totalSize = 0

    for (const file of files) {
      const filePath = path.join(folderPath, file)
      const stats = await promises.stat(filePath)

      if (stats.isDirectory()) {
        totalSize += await this.getFolderSize(filePath) // Recursively get size of subfolders
      } else {
        totalSize += stats.size
      }
    }

    return totalSize
  }

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
    @Body() body: SaveFilesBody,
  ) {
    const token = req.cookies['room_token']
    if (!token) throw new UnauthorizedException('No auth token')

    const fileSizeLimit = body.smallApi === 'true' ? SMALL_API_FILE_SIZE : MAX_FILE_SIZE

    req['fileSizeLimit'] = fileSizeLimit

    try {
      const tokenInfo = this.jwtService.verify<{ nickname: string; roomName: string }>(token)
      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' })
      }
      const roomName = tokenInfo.roomName

      const folderPath = path.join(`./uploads/room_${roomName}`)

      let currentFolderSize = 0
      try {
        await access(folderPath)
        currentFolderSize = await this.getFolderSize(folderPath)
      } catch {
        await mkdir(folderPath, { recursive: true })
        console.log('Folder does not exist, creating it now.')
      }

      // If size of folder higher then limit return error
      if (
        (body.smallApi === 'true' && currentFolderSize >= SMALL_API_MAX_SIZE) ||
        (body.smallApi === 'false' && currentFolderSize >= BIG_API_MAX_SIZE)
      ) {
        return res.status(400).json({
          message: `File limit exceeded. For small API the limit is 15 MB, and for big API the limit is 1 GB.`,
        })
      }

      const savedFilePaths = await this.fileService.saveFiles(roomName, files)

      // Deleting temporary files
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
          .json({ message: `File is too large. Maximum size is ${MAX_FILE_SIZE}MB.` })
      }

      throw new Error(`Error during saving files: ${error}`)
    }
  }
}
