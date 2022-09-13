import { DataSource } from "typeorm";
import { KboMatch } from "@/domain/kbo/domain/model/kboMatch";
import { KboRank } from '@/domain/kbo/domain/model/kboRank';
import { LckMatch } from '@/domain/lck/lckMatch';

export const MysqlDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 9876,
  username: 'root',
  password: 'test',
  database: 'sport_result',
  entities: [KboMatch, KboRank, LckMatch],
  timezone: '+09:00',
  logging: false,
})