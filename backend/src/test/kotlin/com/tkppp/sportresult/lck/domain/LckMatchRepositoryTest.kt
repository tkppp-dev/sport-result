package com.tkppp.sportresult.lck.domain

import com.tkppp.sportresult.lck.util.LckMatchState
import com.tkppp.sportresult.lck.util.LoLTeam
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.test.context.ActiveProfiles
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.LocalTime

@DataJpaTest
@ActiveProfiles("dev")
class LckMatchRepositoryTest(
    @Autowired private val lckMatchRepository: LckMatchRepository
) {

    // global given
    private val today = LocalDate.now()
    private val start = today.with(DayOfWeek.MONDAY)
    private val end = today.with(DayOfWeek.SUNDAY)
    private val outRangeDate = LocalDate.of(2021, 3, 3)
    private val entities = listOf(
        LckMatch(
            matchDate = today,
            startTime = LocalTime.now(),
            matchState = LckMatchState.BEFORE_MATCH,
            home = LoLTeam.BRO,
            away = LoLTeam.DK,
            homeScore = 2,
            awayScore = 1
        ),
        LckMatch(
            matchDate = today,
            startTime = LocalTime.now(),
            matchState = LckMatchState.BEFORE_MATCH,
            home = LoLTeam.BRO,
            away = LoLTeam.DK,
            homeScore = 2,
            awayScore = 1
        ),
        LckMatch(
            matchDate = start,
            startTime = LocalTime.now(),
            matchState = LckMatchState.AFTER_MATCH,
            home = LoLTeam.BRO,
            away = LoLTeam.DK,
            homeScore = 2,
            awayScore = 1
        ),
        LckMatch(
            matchDate = end,
            startTime = LocalTime.now(),
            matchState = LckMatchState.BEFORE_MATCH,
            home = LoLTeam.BRO,
            away = LoLTeam.DK,
            homeScore = 2,
            awayScore = 1
        ),
        LckMatch(
            matchDate = outRangeDate,
            startTime = LocalTime.now(),
            matchState = LckMatchState.AFTER_MATCH,
            home = LoLTeam.BRO,
            away = LoLTeam.DK,
            homeScore = 2,
            awayScore = 1
        )
    )

    @BeforeEach
    fun setup() {
        lckMatchRepository.saveAll(entities)
    }

    @Test
    @DisplayName("두 날짜 사이의 모든 매치 엔티티를 반환해야한다")
    fun findMatchesBetweenDate_shouldSuccess() {
        // when
        val result = lckMatchRepository.findMatchesBetweenDate(start, end)

        // then
        assertThat(result.size).isEqualTo(entities.size - 1)
    }

    @Test
    @DisplayName("현재 날짜의 모든 매치 엔티티를 반환해야한다")
    fun findTodayMatches() {
        // given
        val size = if(today.dayOfWeek == DayOfWeek.SUNDAY) 3 else 2
        // when
        val result = lckMatchRepository.findTodayMatches()

        // then
        assertThat(result.size).isEqualTo(size)
        assertThat(result[0].matchDate).isEqualTo(today)
        assertThat(result[1].matchDate).isEqualTo(today)

    }
}