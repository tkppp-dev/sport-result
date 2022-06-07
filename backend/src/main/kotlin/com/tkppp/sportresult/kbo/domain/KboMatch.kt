package com.tkppp.sportresult.kbo.domain

import com.tkppp.sportresult.kbo.util.KboTeam
import com.tkppp.sportresult.kbo.util.MatchProgress
import com.tkppp.sportresult.kbo.util.MatchStatus
import org.hibernate.annotations.ColumnDefault
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import javax.persistence.*

@Entity
class KboMatch(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    val matchDate: LocalDate,

    @Column(nullable = true)
    val startTime: LocalTime? = null,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    var matchStatus: MatchStatus,

    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    var matchProgress: MatchProgress? = null,

    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    val home: KboTeam?,

    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    val away: KboTeam?,

    @Column(nullable = false)
    var homeScore: Int = 0,

    @Column(nullable = false)
    var awayScore: Int = 0,
) {
}