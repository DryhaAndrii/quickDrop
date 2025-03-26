import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { TokenService } from '../services/token.service'

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string }
}

@Injectable()
export class CheckTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  async use(req: RequestWithCookies, res: Response, next: NextFunction) {
    const token = req.cookies?.['room_token']
    if (!token) throw new UnauthorizedException('No auth token')

    try {
      const user = this.jwtService.verify<{ nickname: string; roomName: string; password: string }>(
        token,
      )

      await this.tokenService.updateTokenIssuedAt(user.roomName, user.nickname, user.password)

      const newToken = this.jwtService.sign({
        nickname: user.nickname,
        roomName: user.roomName,
        password: user.password,
      })

      res.cookie('room_token', newToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      })

      req['user'] = user

      next()
    } catch {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
