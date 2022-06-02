package com.tkppp.sportresult.kbo.dto

import com.tkppp.sportresult.kbo.domain.KboMatch
import com.tkppp.sportresult.kbo.util.KboTeam
import com.tkppp.sportresult.kbo.util.MatchStatus
import java.time.LocalTime

data class KboDayResultResponseDto(
    val startTime: LocalTime,
    val matchStatus: MatchStatus,
    val matchProcess: String?,
    val home: KboTeam,
    val away: KboTeam,
    val homeScore: Int,
    val awayScore: Int
) {

    constructor(entity: KboMatch) : this(
        startTime = entity.startTime,
        matchStatus = entity.matchStatus,
        matchProcess = entity.matchProgress,
        home = entity.home,
        away = entity.away,
        homeScore = entity.homeScore,
        awayScore = entity.awayScore
    )
}