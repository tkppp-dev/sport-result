package com.tkppp.sportresult.kbo.dto

import com.tkppp.sportresult.kbo.util.KboTeam
import com.tkppp.sportresult.kbo.util.MatchProgress

data class KboDayMatchRequestDto(
    val home: KboTeam,
    val away: KboTeam,
    val homeScore: Int,
    val awayScore: Int,
    val matchProgress: MatchProgress?
)
