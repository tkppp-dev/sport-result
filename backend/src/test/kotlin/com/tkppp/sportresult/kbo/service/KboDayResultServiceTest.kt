package com.tkppp.sportresult.kbo.service

import com.tkppp.sportresult.kbo.domain.KboMatch
import com.tkppp.sportresult.kbo.domain.KboMatchRepository
import com.tkppp.sportresult.kbo.dto.KboDayMatchRequestDto
import com.tkppp.sportresult.kbo.dto.KboDayResultResponseDto
import com.tkppp.sportresult.kbo.util.KboTeam
import com.tkppp.sportresult.kbo.util.MatchProgress
import com.tkppp.sportresult.kbo.util.MatchStatus
import io.mockk.every
import io.mockk.junit5.MockKExtension
import io.mockk.mockk
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.not
import org.hamcrest.Matchers.any
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Captor
import java.time.LocalDate
import java.time.LocalTime

@ExtendWith(MockKExtension::class)
internal class KboDayResultServiceTest {
    private val kboMatchRepository = mockk<KboMatchRepository>(relaxed = true)
    private val kboDayResultService = KboDayResultService(kboMatchRepository)

    @Test
    @DisplayName("KBO 당일 경기 결과 조회 테스트 - 성공")
    fun getDayResult_shouldSuccess() {
        // given
        val match = listOf(
            KboMatch(
                id = 1,
                matchDate = LocalDate.now(),
                startTime = LocalTime.now(),
                matchStatus = MatchStatus.BEFORE_MATCH,
                home = KboTeam.SS,
                away = KboTeam.HH,
            ),
            KboMatch(
                id = 2,
                matchDate = LocalDate.now(),
                startTime = LocalTime.now(),
                matchStatus = MatchStatus.BEFORE_MATCH,
                home = KboTeam.LT,
                away = KboTeam.LG,
            )
        )
        // stub
        every { kboMatchRepository.findKboDayMatch() } returns match

        // when
        val result = kboDayResultService.getDayResult()

        // then
        assertThat(result.size).isEqualTo(2)
        assertThat(result).isEqualTo(match.map { KboDayResultResponseDto(it) })
    }

    @Test
    @DisplayName("KBO 당일 경기 결과 업데이트 테스트")
    fun updateDayMatch() {
        // given
        val matches = listOf(
            KboDayMatchRequestDto(
                home = KboTeam.SS,
                away = KboTeam.HH,
                homeScore = 2,
                awayScore = 1,
                matchProgress = MatchProgress.DOWN_1
            ),
            KboDayMatchRequestDto(
                home = KboTeam.LT,
                away = KboTeam.LG,
                homeScore = 2,
                awayScore = 1,
                matchProgress = MatchProgress.DOWN_9
            ),

        )
        val todayMatches = listOf(
            KboMatch(
                id = 1,
                matchDate = LocalDate.now(),
                startTime = LocalTime.now(),
                matchStatus = MatchStatus.BEFORE_MATCH,
                home = KboTeam.SS,
                away = KboTeam.HH,
            ),
            KboMatch(
                id = 2,
                matchDate = LocalDate.now(),
                startTime = LocalTime.now(),
                matchStatus = MatchStatus.AFTER_MATCH,
                matchProgress = MatchProgress.MATCH_END,
                home = KboTeam.LT,
                away = KboTeam.LG,
            )
        )
        // stub
        every { kboMatchRepository.findKboMatchByMatchDate(any())} returns todayMatches
        every { kboMatchRepository.save(any()) } returns todayMatches[0]

        // when
        val result = kboDayResultService.updateDayMatch(matches)
        val shouldChange = result[0]
        val notChange = result[1]

        // then
        assertThat(shouldChange.matchStatus).isEqualTo(MatchStatus.ON_GOING)
        assertThat(shouldChange.homeScore).isEqualTo(matches[0].homeScore)
        assertThat(shouldChange.awayScore).isEqualTo(matches[0].awayScore)
        assertThat(shouldChange.matchProgress).isEqualTo(matches[0].matchProgress)

        assertThat(notChange.matchStatus).isEqualTo(todayMatches[1].matchStatus)
        assertThat(notChange.homeScore).isEqualTo(todayMatches[1].homeScore)
        assertThat(notChange.awayScore).isEqualTo(todayMatches[1].awayScore)
        assertThat(notChange.matchProgress).isEqualTo(todayMatches[1].matchProgress)
    }


}