package com.tkppp.sportresult.lck.dto

import java.time.LocalDate

data class LckDayMatchResDto(
    val date: LocalDate,
    val matches: List<LckMatchResDto>
)