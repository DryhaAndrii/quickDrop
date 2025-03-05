import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
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

  @Column('text', { array: true, default: () => "'{}'" })
  users: string[]
}
