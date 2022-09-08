import { setupSchedulers, setupDefaultScheduler } from '@/config/config.scheduler'

export async function loadScheduler() {
  await setupSchedulers()
  await setupDefaultScheduler()
}