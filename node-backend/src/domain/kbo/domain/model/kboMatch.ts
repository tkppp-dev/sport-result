import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ValueTransformer } from 'typeorm'
import { MatchProgress, Team, matchProgressEnum, teamEnum } from './vo/kbo.vo'
import { DateUtils } from '../../../../utils/dateUtils';

@Entity()
export class KboMatch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'datetime', nullable: false })
  matchDatetime: Date

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
    const start = DateUtils.getDatetime()
    const end = DateUtils.getDatetime({hour: 23, min: 59, sec: 59, ms: 999})

    return this.createQueryBuilder()
      .where('matchDatetime >= :start and matchDatetime <= :end', { start, end })
      .getMany()
  }
}
