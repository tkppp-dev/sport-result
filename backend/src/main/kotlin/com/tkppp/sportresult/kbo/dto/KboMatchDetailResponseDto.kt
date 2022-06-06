package com.tkppp.sportresult.kbo.dto

import com.tkppp.sportresult.kbo.domain.KboMatch
import com.tkppp.sportresult.kbo.util.KboTeam
import com.tkppp.sportresult.kbo.util.MatchStatus
import java.time.LocalDate
import java.time.LocalTime

data class KboMatchDetailResponseDto (
    val startTime: List<Int>?,
    val matchStatus: MatchStatus,
    val home: KboTeam?,
    val away: KboTeam?,
    val homeScore: Int,
    val awayScore: Int
) {

    fun toEntity(date: LocalDate): KboMatch {
        return KboMatch(
            matchDate = date,
            startTime = startTime?.let { LocalTime.of(it[0], it[1]) },
            matchStatus = matchStatus,
            home = home,
            away = away,
            homeScore = homeScore,
            awayScore = awayScore
        )
    }
}
