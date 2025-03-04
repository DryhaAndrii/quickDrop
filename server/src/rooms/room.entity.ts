import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm'
import { User } from '@/src/users/user.entity'

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  roomId: string

  @Column()
  password: string

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @ManyToMany(() => User, (user) => user.rooms)
  @JoinTable()
  users: User[]
}
