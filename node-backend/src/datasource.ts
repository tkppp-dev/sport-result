import { DataSource } from "typeorm";
import { KboMatch } from "./domain/kbo/kboMatch";
import { KboRank } from './domain/kbo/kboRank';
import { LckMatch } from './domain/lck/lckMatch';

let host, username, password, synchronize, logging
if(process.env.NODE_ENV === 'production') {
  host = process.env.DB_HOST
  username = process.env.DB_USER
  password = process.env.DB_PASSWORD
  synchronize = false,
  logging = false
} else if (process.env.NODE_ENV === 'development') {
  host = '127.0.0.1'
  username = 'root'
  password = 'root'
  synchronize = true
  logging = true
}

export const MysqlDateSource = new DataSource({
  type: 'mysql',
  host,
  port: 3306,
  username,
  password,
  database: 'sport_result',
  entities: [KboMatch, KboRank, LckMatch],
  synchronize,
  logging
})