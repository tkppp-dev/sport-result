package com.tkppp.sportresult.lck.dto

data class LckWeekMatchResDto(
    var todayMatches: LckDayMatchResDto? = null,
    val weekMatches: MutableList<LckDayMatchResDto> = mutableListOf()
)