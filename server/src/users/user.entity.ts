// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm'
import { Room } from '@/src/rooms/room.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  nickname: string

  @ManyToMany(() => Room, (room) => room.users)
  @JoinTable()
  rooms: Room[]
}
