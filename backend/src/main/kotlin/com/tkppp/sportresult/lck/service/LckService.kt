package com.tkppp.sportresult.lck.service

import com.tkppp.sportresult.exception.CustomException
import com.tkppp.sportresult.exception.ErrorCode
import com.tkppp.sportresult.lck.domain.LckMathRepository
import com.tkppp.sportresult.lck.dto.*
import com.tkppp.sportresult.lck.util.LckMatchState
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.exchange
import java.time.DayOfWeek
import java.time.LocalDate

@Service
class LckService(
    private val lckMatchRepository: LckMathRepository,
    private val restTemplate: RestTemplate
) {

    @Transactional
    fun putLckMatchService(year: Int, month: Int) {
        val url = "http://localhost:3000/api/lck/schedule?year=$year&month=$month"
        val schedules = try {
            restTemplate.exchange<List<LckSchedulePutRequestDto>>(url, HttpMethod.GET).body!!
        } catch (ex: RuntimeException) {
            throw CustomException(ErrorCode.CRAWLING_SERVER_REQUEST_ERROR, ex)
        }

        val start = LocalDate.of(year, month, 1)
        val end = start.plusDays(start.lengthOfMonth() - 1L)
        val entities = lckMatchRepository.findMatchesBetweenDate(start, end)
        lckMatchRepository.deleteAll(entities)

        schedules.forEach {
            it.matches.forEach { match ->
                lckMatchRepository.save(match.toEntity(it.date))
            }
        }
    }

    @Transactional
    fun patchLckMatchService(dto: List<LckMatchPatchReqDto>) {
        val matches = lckMatchRepository.findTodayMatches()

        matches.forEach { entity ->
            if (entity.matchState == LckMatchState.AFTER_MATCH) {
                return@forEach
            } else {
                for (match in dto) {
                    if (match.home == entity.home.shortName && match.away == entity.away.shortName) {
                        entity.matchState = match.state
                        entity.homeScore = match.homeScore
                        entity.awayScore = match.awayScore
                        break
                    }
                }
            }
        }

        lckMatchRepository.saveAll(matches)
    }

    fun getLckWeekMatchService(): LckWeekMatchResDto {
        val today = LocalDate.now()
        val start = today.with(DayOfWeek.MONDAY)
        val end = today.with(DayOfWeek.SUNDAY)

        val entityMap = lckMatchRepository.findMatchesBetweenDate(start, end).groupBy { it.matchDate }
        val responseDto = LckWeekMatchResDto()

        var tempDate = start
        while (tempDate <= end) {
            if (entityMap.containsKey(tempDate)) {
                val dayDto = LckDayMatchResDto(tempDate, entityMap[tempDate]!!.map { LckMatchResDto(it) })
                responseDto.weekMatches.add(dayDto)
                if (tempDate == today) {
                    responseDto.todayMatches = dayDto
                }
            } else {
                tempDate = tempDate.plusDays(1)
            }
        }

        return responseDto
    }
}