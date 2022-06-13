package com.tkppp.sportresult.kbo.dto

import com.tkppp.sportresult.kbo.domain.KboMatch
import com.tkppp.sportresult.kbo.util.KboTeam
import com.tkppp.sportresult.kbo.util.MatchProgress
import com.tkppp.sportresult.kbo.util.MatchStatus
import java.time.LocalDate
import java.time.LocalTime

data class KboDayResultResponseDto(
    var matchDate: String = "",
    var startTime: String = "",
    val matchStatus: MatchStatus,
    val matchProgress: MatchProgress?,
    val home: String?,
    val away: String?,
    val homeCode: String?,
    val awayCode: String?,
    val homeScore: Int,
    val awayScore: Int
) {

    fun getDateString(date: LocalDate): String{
        val dateString = StringBuilder()

        dateString.append(date.year)
        dateString.append(if(date.monthValue < 10) "0${date.monthValue}" else "${date.monthValue}")
        dateString.append(if(date.dayOfMonth < 10) "0${date.dayOfMonth}" else "${date.dayOfMonth}")

        return dateString.toString()
    }

    fun getStartTimeString(time: LocalTime): String {
        val timeString = StringBuilder()
        timeString.append("${time.hour}:")
        timeString.append(if(time.minute < 10) "0${time.minute}" else "${time.minute}")

        return timeString.toString()
    }

    constructor(entity: KboMatch) : this(
        matchStatus = entity.matchStatus,
        matchProgress = entity.matchProgress,
        home = entity.home?.fullName,
        away = entity.away?.fullName,
        homeCode = entity.home?.code,
        awayCode = entity.away?.code,
        homeScore = entity.homeScore,
        awayScore = entity.awayScore
    ) {
        matchDate = getDateString(entity.matchDate)
        startTime = entity.startTime?.let { getStartTimeString(it) } ?: ""
    }
}