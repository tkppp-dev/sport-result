package com.tkppp.sportresult.kbo.service

import com.tkppp.sportresult.kbo.domain.KboMatch
import com.tkppp.sportresult.kbo.domain.KboMatchRepository
import com.tkppp.sportresult.kbo.dto.KboDayResultResponseDto
import com.tkppp.sportresult.kbo.util.KboTeam
import com.tkppp.sportresult.kbo.util.MatchStatus
import io.mockk.every
import io.mockk.junit5.MockKExtension
import io.mockk.mockk
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import java.time.LocalDate
import java.time.LocalTime

@ExtendWith(MockKExtension::class)
internal class KboDayResultServiceTest {
    private val kboMatchRepository = mockk<KboMatchRepository>()
    private val kboDayResultService = KboDayResultService(kboMatchRepository)

    @Nested
    @DisplayName("KBO 당일 경기 결과 조회 서비스 테스트")
    inner class DayMatchResultTest {

        @Test
        @DisplayName("KBO 당일 경기 결과 조회 성공")
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
    }

}