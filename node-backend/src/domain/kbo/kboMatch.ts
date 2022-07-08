import { localDate, localDatetime } from '@/utils/date'
import moment from 'moment'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { MatchProgress, Team, matchProgressEnum, teamEnum } from './kbo.utils'

@Entity()
export class KboMatch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'date', nullable: false })
  matchDate: Date

  @Column({ type: 'time', nullable: false })
  startTime: Date

  @Column({
    type: 'enum',
    enum: matchProgressEnum,
    nullable: false,
  })
  matchProgress: MatchProgress

  @Column({
    type: 'enum',
    enum: teamEnum,
    nullable: false,
  })
  home: Team

  @Column({
    type: 'enum',
    enum: teamEnum,
    nullable: false,
  })
  away: Team

  @Column({
    default: 0,
    nullable: false,
  })
  homeScore: number

  @Column({
    default: 0,
    nullable: false,
  })
  awayScore: number

  static findTodayMatches() {
    return this.createQueryBuilder()
      .where('matchDate = :today', {today: moment(localDate()).format('YYYY-MM-DD')})
      .getMany()
  }
}
