import { IsString, Length } from 'class-validator'

export class RoomDto {
  @IsString()
  @Length(3, 10, { message: 'Room id must be between 3 and 10 characters' })
  roomName: string

  @IsString()
  @Length(3, 10, { message: 'Password must be between 3 and 10 characters' })
  password: string
}
