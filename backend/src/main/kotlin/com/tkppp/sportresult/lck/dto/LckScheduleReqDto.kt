package com.tkppp.sportresult.lck.dto

data class LckSchedulePutRequestDto(
    val date: List<String>,
    val matches: List<LckMatchPutReqDto>
)