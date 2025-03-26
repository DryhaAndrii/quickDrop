import { Controller, Res, Post, Body } from '@nestjs/common'
import { Response } from 'express'
import { MessagesService } from '../services/messages.service'

@Controller('rooms')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('addMessage')
  async addMessage(
    @Body('roomName') roomName: string,
    @Body('nickname') nickname: string,
    @Body('text') text: string,
    @Res() res: Response,
  ) {
    if (!roomName || !nickname || !text) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    try {
      await this.messagesService.addMessage(roomName, nickname, text)
      return res.json({ message: 'Message added successfully' })
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Failed to add message', error: (error as Error).message })
    }
  }
}
