import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { MatchProgress, LoLTeam } from './lck.utils';
import moment from 'moment';
import { localDate } from '@/utils/date';

@Entity()
export class LckMatch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'date', nullable: false })
  matchDate: Date

  @Column({ type: 'time', nullable: false })
  startTime: Date

  @Column({
    type: 'enum',
    enum: MatchProgress,
    nullable: false,
  })
  matchProgress: string

  @Column({
    type: 'enum',
    enum: LoLTeam,
    nullable: false,
  })
  home: LoLTeam

  @Column({
    type: 'enum',
    enum: LoLTeam,
    nullable: false,
  })
  away: LoLTeam

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

  static findTodayMatches(){
    return this.createQueryBuilder()
      .where('matchDate = :today', {today: moment(localDate()).format('YYYY-MM-DD')})
      .getMany()
  }

  static findThisWeekMatches() {
    const startDate = localDate()
    const endDate = localDate()
    let dayOffset = localDate().getDay()
    dayOffset = dayOffset === 0 ? 6 : dayOffset - 1

    startDate.setDate(startDate.getDate() - dayOffset)
    endDate.setDate(endDate.getDate() + 6 - dayOffset)

    return this.createQueryBuilder()
      .where('matchDate >= :start and matchDate <= :end', {
        start: moment(startDate).format('YYYY-MM-DD'),
        end: moment(endDate).format('YYYY-MM-DD')
      })
      .getMany()
  }
}