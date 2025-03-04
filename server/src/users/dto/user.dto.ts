import { IsString, Length } from 'class-validator'

export class UserDto {
  @IsString()
  @Length(3, 20, { message: 'User nickname id must be between 3 and 20 characters' })
  nickname: string
}
