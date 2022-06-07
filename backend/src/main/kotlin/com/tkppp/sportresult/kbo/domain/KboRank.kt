package com.tkppp.sportresult.kbo.domain

import com.tkppp.sportresult.kbo.util.KboTeam
import javax.persistence.*

@Entity
class KboRank(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    val rank: Int,

    @Enumerated(EnumType.STRING)
    var name: KboTeam,

    @Column(nullable = false)
    var played: Int,

    @Column(nullable = false)
    var win: Int,

    @Column(nullable = false)
    var draw: Int,

    @Column(nullable = false)
    var defeat: Int,

    @Column(nullable = false)
    var winRate: Float,

    @Column(nullable = false)
    var gameDiff: Float,
)