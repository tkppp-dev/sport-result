package com.tkppp.sportresult.kbo.dto

data class KboMatchResponseDto(
    val matchDate: List<Int>,
    val matchInfo: List<KboMatchDetailResponseDto>
)
