package com.tkppp.sportresult.lck.domain

import com.tkppp.sportresult.lck.util.LoLTeam
import com.tkppp.sportresult.lck.util.LckMatchState
import java.time.LocalDate
import java.time.LocalTime
import javax.persistence.*

@Entity
class LckMatch(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    val matchDate: LocalDate,

    @Column(nullable = false)
    val startTime: LocalTime,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    var matchState: LckMatchState,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    val home: LoLTeam,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    val away: LoLTeam,

    @Column(nullable = false)
    var homeScore: Int,

    @Column(nullable = false)
    var awayScore: Int
) {
}