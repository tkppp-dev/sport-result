import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { Team, teamEnum } from './kbo.utils'

@Entity()
export class KboRank extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  ranking: number

  @Column({ nullable: false, type: 'enum', enum: teamEnum })
  name: Team

  @Column({ nullable: false })
  played: number

  @Column({ nullable: false })
  win: number

  @Column({ nullable: false })
  draw: number

  @Column({ nullable: false })
  defeat: number

  @Column({ nullable: false, type: 'float'})
  winRate: number

  @Column({ nullable: false, type: 'float'})
  gameDiff: number
}
