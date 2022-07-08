import { DataSource } from "typeorm";
import { KboMatch } from "./domain/kbo/kboMatch";
import { KboRank } from './domain/kbo/kboRank';

export const MysqlDateSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'sport_result',
  entities: [KboMatch, KboRank],
  synchronize: true,
  logging: true
})