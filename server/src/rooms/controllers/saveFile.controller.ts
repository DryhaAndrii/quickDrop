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
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { randomUUID } from 'crypto'
import { unlink, access, mkdir } from 'fs/promises'
import { promises } from 'fs'
import * as path from 'path'
import { FilesService } from '../services/files.service'
import { ConfigService } from '@nestjs/config'

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string }
}
function bytesToMb(bytes: number, rounded = false): number {
  const result = bytes / 1024 / 1024
  return rounded ? Number(result.toFixed(2)) : result
}
function mbToBytes(mb: number): number {
  return mb * 1024 * 1024
}
@Controller('rooms')
export class SavesFileController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly fileService: FilesService,
    private configService: ConfigService,
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
    }),
  )
  async saveFile(
    @Req() req: RequestWithCookies,
    @Res() res: Response,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const token = req.cookies['room_token']
    if (!token) throw new UnauthorizedException('No auth token')

    const maxFilesSize = mbToBytes(this.configService.get<number>('MAX_FILES_SIZE') ?? 1)

    let filesSize = 0
    for (const file of files) {
      filesSize = filesSize + file.size
    }

    if (filesSize >= maxFilesSize) {
      console.log('Files size is bigger then maxFileSize:', filesSize, '>', maxFilesSize)
      return res.status(400).json({
        message: `Files limit exceeded. The limit is ${bytesToMb(maxFilesSize)} MB`,
      })
    }

    const maxRoomSize = mbToBytes(this.configService.get<number>('MAX_ROOM_SIZE') ?? 15)

    const maxApiSize = mbToBytes(this.configService.get<number>('MAX_API_SIZE') ?? 100)

    try {
      const tokenInfo = this.jwtService.verify<{ nickname: string; roomName: string }>(token)
      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' })
      }
      const { roomName, nickname } = tokenInfo

      //Checking if api have enough space
      const uploadsFolderPath = path.join(`./uploads`)

      let uploadsFolderSize = 0
      try {
        await access(uploadsFolderPath)
        uploadsFolderSize = await this.getFolderSize(uploadsFolderPath)
      } catch {
        await mkdir(uploadsFolderPath, { recursive: true })
        console.log('Folder does not exist, creating it now.')
      }

      if (uploadsFolderSize + filesSize >= maxApiSize) {
        console.log(
          'If we will save these files we will exceed api limit: uploadsFolderSize:',
          bytesToMb(uploadsFolderSize, true),
          'FilesSize:',
          bytesToMb(filesSize, true),
          'maxApiSize:',
          bytesToMb(maxApiSize),
        )
        return res.status(400).json({
          message: `Cannot save files. Your files is ${bytesToMb(filesSize, true)},
          free space in api is: ${bytesToMb(maxApiSize - uploadsFolderSize, true)}`,
        })
      }

      //Checking if room folder have enough space
      const roomFolderPath = path.join(`./uploads/room_${roomName}`)

      let roomFolderSize = 0
      try {
        await access(roomFolderPath)
        roomFolderSize = await this.getFolderSize(roomFolderPath)
      } catch {
        await mkdir(roomFolderPath, { recursive: true })
        console.log('Folder does not exist, creating it now.')
      }

      console.log(
        'RoomFolderSize:',
        bytesToMb(roomFolderSize, true),
        'filesSize:',
        bytesToMb(filesSize, true),
        'maxRoomSize:',
        bytesToMb(maxRoomSize, true),
      )
      if (roomFolderSize + filesSize >= maxRoomSize) {
        console.log(
          'If we will save these files we will exceed room limit: folderSize:',
          bytesToMb(roomFolderSize, true),
          'FilesSize:',
          bytesToMb(filesSize, true),
          'MaxRoomSize:',
          bytesToMb(maxRoomSize),
        )
        return res.status(400).json({
          message: `Cannot save files. Your files is ${bytesToMb(filesSize, true)},
          free space in room is: ${bytesToMb(maxRoomSize - roomFolderSize, true)}`,
        })
      }

      const savedFilePaths = await this.fileService.saveFiles(roomName, nickname, files)

      // Deleting temporary files
      await Promise.all(files.map((file) => unlink(file.path)))
      return res.json({
        message: 'Files saved successfully!',
        filePaths: savedFilePaths,
      })
    } catch (error) {
      throw new Error(`Error during saving files: ${error}`)
    }
  }
}
