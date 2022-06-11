package com.tkppp.sportresult.config.scheduler

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.TaskScheduler
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler

@Configuration
class SchedulerConfig {

    @Bean
    fun poolScheduler(): TaskScheduler {
        val threadPoolTaskScheduler = ThreadPoolTaskScheduler()
        threadPoolTaskScheduler.poolSize = 4
        threadPoolTaskScheduler.setThreadNamePrefix("main-scheduler")
        return threadPoolTaskScheduler
    }

}