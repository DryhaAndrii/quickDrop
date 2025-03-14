import { Controller, Res, Delete, Query } from '@nestjs/common'
import { Response } from 'express'
import { FilesService } from '../services/files.service'

@Controller('rooms')
export class DeleteFileController {
  constructor(private readonly filesService: FilesService) {}

  @Delete('deleteFile')
  async deleteFile(
    @Query('roomName') roomName: string,
    @Query('storedName') storedName: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.filesService.deleteFile(roomName, storedName)
      res.json(result)
    } catch (error) {
      throw new Error(`Error during deleting file: ${error}`)
    }
  }
}
