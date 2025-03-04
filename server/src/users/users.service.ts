import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByNickname(nickname: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { nickname } })
  }

  async createUser(nickname: string): Promise<User> {
    const newUser = this.usersRepository.create({ nickname })
    return await this.usersRepository.save(newUser)
  }
}
