package com.tkppp.sportresult.kbo.controller

import com.tkppp.sportresult.kbo.domain.KboMatch
import com.tkppp.sportresult.kbo.dto.KboDayResultResponseDto
import com.tkppp.sportresult.kbo.service.KboDayResultService
import com.tkppp.sportresult.kbo.util.KboTeam
import com.tkppp.sportresult.kbo.util.MatchStatus
import io.mockk.every
import io.mockk.junit5.MockKExtension
import io.mockk.mockk
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import java.time.LocalDate
import java.time.LocalTime

@ExtendWith(MockKExtension::class)
internal class KboDayResultControllerTest {

    private val kboDayResultService = mockk<KboDayResultService>()
    private val kboDayResultController = KboDayResultController(kboDayResultService)

    @Nested
    @DisplayName("KBO 당일 경기 결과 조회 컨트롤러 유닛 테스트")
    inner class DayMatchResultControllerTest {

        @Test
        @DisplayName("KBO 당일 경기 결과 조회 성공")
        fun returnDayResult() {
            // given
            val matchDtoList = listOf(
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
            ).map { KboDayResultResponseDto(it) }

            // stub
            every { kboDayResultService.getDayResult() } returns matchDtoList

            // when
            val result = kboDayResultController.returnDayResult()

            // then
            assertThat(result).isInstanceOf(ResponseEntity::class.java)
            assertThat(result.statusCode).isEqualTo(HttpStatus.OK)
            assertThat(result.body).isEqualTo(matchDtoList)

        }
    }
}