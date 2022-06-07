package com.tkppp.sportresult.kbo.dto

import com.fasterxml.jackson.annotation.JsonValue
import com.tkppp.sportresult.kbo.domain.KboRank
import com.tkppp.sportresult.kbo.util.KboTeam

data class KboRankDto(
    val rank: Int,
    @JsonValue val name: KboTeam,
    val played: Int,
    val win: Int,
    val draw: Int,
    val defeat: Int,
    val winRate: Float,
    val gameDiff: Float,
) {
    fun toEntity() =
        KboRank(
            rank = rank,
            name = name,
            played = played,
            win = win,
            draw = draw,
            defeat = defeat,
            winRate = winRate,
            gameDiff = gameDiff
        )
}