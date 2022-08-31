import { setupSchedulers, setupDefaultScheduler } from '@/config/config.scheduler'

export default async function loadScheduler() {
  await setupSchedulers()
  await setupDefaultScheduler()
}