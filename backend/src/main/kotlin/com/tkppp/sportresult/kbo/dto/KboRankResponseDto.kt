package com.tkppp.sportresult.kbo.dto

import com.tkppp.sportresult.kbo.domain.KboRank

data class KboRankResponseDto(
    val rank: Int,
    val name: String,
    val played: Int,
    val win: Int,
    val draw: Int,
    val defeat: Int,
    val winRate: Float,
    val gameDiff: Float,
) {
    constructor(kboRank: KboRank) : this(
        rank = kboRank.ranking,
        name = kboRank.name.fullName,
        played = kboRank.played,
        win = kboRank.win,
        draw = kboRank.draw,
        defeat = kboRank.defeat,
        winRate = kboRank.winRate,
        gameDiff = kboRank.gameDiff
    )
}
