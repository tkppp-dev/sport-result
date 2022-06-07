package com.tkppp.sportresult.kbo.domain

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.LocalDate

interface KboMatchRepository : JpaRepository<KboMatch, Long> {

    @Query("""
        select m
        from KboMatch as m
        where m.matchDate = current_date
    """)
    fun findKboDayMatch(): List<KboMatch>

    fun findKboMatchByMatchDate(date: LocalDate): List<KboMatch>
}