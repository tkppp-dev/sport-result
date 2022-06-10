package com.tkppp.sportresult.kbo.dto

import com.tkppp.sportresult.kbo.domain.KboMatch
import com.tkppp.sportresult.kbo.util.KboTeam
import com.tkppp.sportresult.kbo.util.MatchProgress
import com.tkppp.sportresult.kbo.util.MatchStatus
import java.time.LocalTime

data class KboDayResultResponseDto(
    val startTime: LocalTime?,
    val matchStatus: MatchStatus,
    val matchProgress: MatchProgress?,
    val home: String?,
    val away: String?,
    val homeScore: Int,
    val awayScore: Int
) {

    constructor(entity: KboMatch) : this(
        startTime = entity.startTime,
        matchStatus = entity.matchStatus,
        matchProgress = entity.matchProgress,
        home = entity.home?.fullName,
        away = entity.away?.fullName,
        homeScore = entity.homeScore,
        awayScore = entity.awayScore
    )
}