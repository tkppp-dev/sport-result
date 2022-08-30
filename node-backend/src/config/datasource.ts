import { DataSource } from "typeorm";
import { KboMatch } from "../domain/kbo/kboMatch";
import { KboRank } from '../domain/kbo/kboRank';
import { LckMatch } from '../domain/lck/lckMatch';

const host = process.env.DB_HOST
const username = process.env.DB_USER
const password = process.env.DB_PASSWORD
let synchronize, logging
if(process.env.NODE_ENV === 'production') {
  synchronize = false,
  logging = false
} else if (process.env.NODE_ENV === 'development') {
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