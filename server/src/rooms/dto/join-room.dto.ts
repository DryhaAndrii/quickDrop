import { IsString, Length } from 'class-validator'

export class JoinRoomDto {
  @IsString()
  @Length(3, 10)
  roomId: string

  @IsString()
  @Length(3, 20)
  nickName: string
}
