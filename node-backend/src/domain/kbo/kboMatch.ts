import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MatchStatus, MatchProgress, Team } from './kbo.utils';

@Entity()
export class KboMatch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: false })
  matchDate: Date;

  @Column({ type: 'time', nullable: false })
  startTime: Date;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.BEFORE_MATCH,
    nullable: false,
  })
  matchStatus: MatchStatus;

  @Column({
    type: 'enum',
    enum: MatchProgress,
    default: null,
    nullable: true,
  })
  matchProgress: MatchProgress;

  @Column({
    type: 'enum',
    enum: Team,
    nullable: false,
  })
  home: Team;

  @Column({
    type: 'enum',
    enum: Team,
    nullable: false,
  })
  away: Team;

  @Column({
    default: 0,
    nullable: false,
  })
  homeScore: number;

  @Column({
    default: 0,
    nullable: false,
  })
  awayScore: number;
}
