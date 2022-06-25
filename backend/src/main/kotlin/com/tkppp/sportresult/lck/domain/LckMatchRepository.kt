package com.tkppp.sportresult.lck.domain

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.LocalDate

interface LckMatchRepository : JpaRepository<LckMatch, Long> {

    @Query("""
        select m from LckMatch as m
        where m.matchDate >= :startDate and m.matchDate <= :endDate
        order by m.matchDate asc 
    """)
    fun findMatchesBetweenDate(startDate: LocalDate, endDate: LocalDate): List<LckMatch>

    @Query("""
        select m from LckMatch as m
        where m.matchDate = current_date 
    """)
    fun findTodayMatches(): List<LckMatch>
}