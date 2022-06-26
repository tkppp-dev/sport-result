package com.tkppp.sportresult.lck.dto

import com.tkppp.sportresult.lck.util.LckMatchState

data class LckMatchPatchReqDto(
    val state: LckMatchState,
    val home: String,
    val away: String,
    val homeScore: Int,
    val awayScore: Int
)