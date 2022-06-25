package com.tkppp.sportresult.lck.dto

import com.tkppp.sportresult.lck.domain.LckMatch
import com.tkppp.sportresult.lck.util.LckMatchState
import com.tkppp.sportresult.lck.util.LoLTeam
import java.time.LocalDate
import java.time.LocalTime

data class LckMatchPutReqDto(
    val startTime: List<String>,
    val state: LckMatchState,
    val home: LoLTeam,
    val away: LoLTeam,
    val homeScore: Int,
    val awayScore: Int
) {

    fun toEntity(matchDate: List<String>): LckMatch = LckMatch(
        matchDate = LocalDate.of(matchDate[0].toInt(), matchDate[1].toInt(), matchDate[2].toInt()),
        startTime = LocalTime.of(startTime[0].toInt(), startTime[1].toInt(), 0),
        matchState = state,
        home = home,
        away = away,
        homeScore = homeScore,
        awayScore = awayScore
    )

}