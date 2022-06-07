package com.tkppp.sportresult.kbo.dto

data class KboMatchDto(
    val matchDate: List<Int>,
    val matchInfo: List<KboMatchDetailDto>
)
