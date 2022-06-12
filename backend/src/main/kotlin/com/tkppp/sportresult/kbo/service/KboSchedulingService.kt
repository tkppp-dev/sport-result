package com.tkppp.sportresult.kbo.service

import com.tkppp.sportresult.kbo.domain.KboMatchRepository
import com.tkppp.sportresult.kbo.util.MatchStatus
import org.slf4j.LoggerFactory
import org.springframework.http.HttpMethod
import org.springframework.scheduling.TaskScheduler
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.scheduling.support.CronTrigger
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.exchange
import java.time.LocalDateTime
import java.time.LocalTime
import java.util.concurrent.ScheduledFuture
import javax.annotation.PostConstruct

@Service
class KboSchedulingService(
    private val scheduler: TaskScheduler,
    private val kboMatchRepository: KboMatchRepository,
    private val restTemplate: RestTemplate,
) {
    private val logger = LoggerFactory.getLogger(KboSchedulingService::class.java)
    private val dayResultUrl = "http://localhost:3000/api/kbo/day"
    private val rankUrl = "http://localhost:3000/api/kbo/rank"
    var initialScheduler: ScheduledFuture<*>? = null
    var dayMatchStart: LocalTime? = null

    @PostConstruct
    fun init() {
        setDayMatchStartTime()
        val now = LocalDateTime.now()
        val tomorrow = LocalDateTime.of(now.toLocalDate().plusDays(1), LocalTime.of(0, 0, 0))
        if (now.plusMinutes(1) < tomorrow) {
            dayMatchStart?.let {
                val nowTime = now.toLocalTime()
                val cron = if (nowTime >= dayMatchStart) {
                    val schedulerTime = nowTime.plusMinutes(1)
                    "0 ${schedulerTime.minute} ${schedulerTime.hour} ${now.dayOfMonth} ${now.monthValue} ?"
                } else {
                    "0 ${it.minute} ${it.hour} * * ?"
                }

                initialScheduler = scheduler.schedule({
                    try {
                        restTemplate.exchange<Any>(dayResultUrl, HttpMethod.GET, null)
                    } catch (ex: Exception) {
                        logger.error(ex.message)
                    }
                }, CronTrigger(cron))
            }
        }
    }

    @Scheduled(cron = "0 45 1 * * ?")
    fun cancelInitialScheduler() {
        initialScheduler = null
    }

    @Scheduled(cron = "0 0 2 * * ?")
    fun setDayMatchStartTime() {
        val matches = kboMatchRepository.findKboDayMatch()
        if (matches.isNotEmpty() && matches[0].matchStatus != MatchStatus.NO_MATCH) {
            dayMatchStart = matches.minOf { it.startTime!! }
        }
    }

    fun sendMatchResultEvent(baseTime: LocalTime) {
        if (initialScheduler == null && baseTime == dayMatchStart) {
            try {
                restTemplate.exchange<Any>(dayResultUrl, HttpMethod.GET, null)
            } catch (ex: Exception) {
                logger.error(ex.message)
            }
        }
    }

    @Scheduled(cron = "0 0 14 * * ?")
    fun sendMatchResultEventToCrawlingServerWhen1400() {
        val baseTime = LocalTime.of(14, 0, 0)
        sendMatchResultEvent(baseTime)
    }

    @Scheduled(cron = "0 0 17 * * ?")
    fun sendMatchResultEventToCrawlingServerWhen1700() {
        val baseTime = LocalTime.of(17, 0, 0)
        sendMatchResultEvent(baseTime)

    }

    @Scheduled(cron = "0 30 18 * * ?")
    fun sendMatchResultEventToCrawlingServerWhen1830() {
        val baseTime = LocalTime.of(17, 0, 0)
        sendMatchResultEvent(baseTime)
    }

    @Scheduled(cron = "0 0,30 21-23 * * ?")
    fun sendRankEventToCrawlingServer() {
        if (dayMatchStart != null) {
            try {
                restTemplate.exchange<Any>(rankUrl, HttpMethod.GET, null)
            } catch (ex: Exception) {
                logger.error(ex.message)
            }
        }
    }

}