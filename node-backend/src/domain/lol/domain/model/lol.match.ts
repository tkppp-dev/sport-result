import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MatchProgress, LoLProgress } from './lol.vo';

@Entity()
export class LolMatch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'datetime', nullable: false})
  matchDatetime: Date

  @Column({
    type: 'enum',
    enum: LoLProgress,
    nullable: false
  })
  matchProgress: MatchProgress

  @Column({
    type: 'varchar',
    nullable: false
  })
  home: string

  @Column({
    type: 'varchar',
    nullable: false
  })
  away: string

  @Column({
    type: 'enum',
    enum: [0, 1, 2, 3],
    nullable: false
  })
  homeScore: number

  @Column({
    type: 'enum',
    enum: [0, 1, 2, 3],
    nullable: false
  })
  awayScore: number
}