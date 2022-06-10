package com.tkppp.sportresult.kbo.service

import com.tkppp.sportresult.kbo.domain.KboMatchRepository
import com.tkppp.sportresult.kbo.dto.KboDayMatchRequestDto
import com.tkppp.sportresult.kbo.dto.KboDayResultResponseDto
import com.tkppp.sportresult.kbo.util.MatchProgress
import com.tkppp.sportresult.kbo.util.MatchProgress.*
import com.tkppp.sportresult.kbo.util.MatchStatus
import com.tkppp.sportresult.kbo.util.MatchStatus.*
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class KboDayResultService(
    private val kboMatchRepository: KboMatchRepository
) {

    fun getDayResult(): List<KboDayResultResponseDto> {
        val entity = kboMatchRepository.findKboDayMatch()
        return if (entity[0].matchStatus == NO_MATCH) {
            listOf()
        } else {
            entity.map { KboDayResultResponseDto(it) }
        }
    }

    fun updateDayMatch(matches: List<KboDayMatchRequestDto>) {
        val date = LocalDate.now()
        val todayMatches = kboMatchRepository.findKboMatchByMatchDate(date)

        for (todayMatch in todayMatches) {
            when (todayMatch.matchStatus) {
                BEFORE_MATCH, ON_GOING -> {
                    for (match in matches) {
                        if (match.home == todayMatch.home && match.away == todayMatch.away) {
                            todayMatch.matchProgress = match.matchProgress
                            todayMatch.homeScore = match.homeScore
                            todayMatch.awayScore = match.awayScore

                            when (todayMatch.matchProgress) {
                                MATCH_BEFORE -> {}
                                MATCH_END -> todayMatch.matchStatus = AFTER_MATCH
                                MatchProgress.CANCELED -> todayMatch.matchStatus = MatchStatus.CANCELED
                                else -> if (todayMatch.matchStatus == BEFORE_MATCH) todayMatch.matchStatus = ON_GOING
                            }

                            kboMatchRepository.save(todayMatch)
                            break
                        }
                    }
                }
                else -> {}
            }
        }
    }

}