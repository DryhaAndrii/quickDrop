import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  roomName: string

  @Column()
  password: string

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column('json', { default: () => "'[]'" })
  users: { nickname: string; tokenIssuedAt: Date }[]
}
