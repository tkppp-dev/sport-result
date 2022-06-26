package com.tkppp.sportresult.lck.dto

import com.tkppp.sportresult.lck.domain.LckMatch
import java.time.LocalTime

data class LckMatchResDto(
    val startTime: LocalTime,
    val state: String,
    val home: String,
    val away: String,
    val homeScore: Int,
    val awayScore: Int
) {
    constructor(entity: LckMatch) : this(
        startTime = entity.startTime,
        state = entity.matchState.fullName,
        home = entity.home.shortName,
        away = entity.away.shortName,
        homeScore = entity.homeScore,
        awayScore = entity.awayScore
    )
}