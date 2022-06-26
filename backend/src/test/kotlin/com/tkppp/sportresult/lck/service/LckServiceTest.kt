package com.tkppp.sportresult.lck.service

import com.tkppp.sportresult.lck.domain.LckMatch
import com.tkppp.sportresult.lck.domain.LckMatchRepository
import com.tkppp.sportresult.lck.dto.LckMatchPatchReqDto
import com.tkppp.sportresult.lck.dto.LckMatchPutReqDto
import com.tkppp.sportresult.lck.dto.LckSchedulePutRequestDto
import com.tkppp.sportresult.lck.util.LckMatchState
import com.tkppp.sportresult.lck.util.LoLTeam
import io.mockk.*
import io.mockk.junit5.MockKExtension
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.exchange
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.LocalTime

@ExtendWith(MockKExtension::class)
internal class LckServiceTest {

    private val lckMatchRepository: LckMatchRepository = mockk(relaxed = true)
    private val restTemplate: RestTemplate = mockk()
    private val lckService = LckService(lckMatchRepository, restTemplate)

    @Test
    fun putLckMatchService_shouldSuccess() {
        // given
        val today = LocalDate.now()
        val startDate = today.withDayOfMonth(1)
        val endDate = today.withDayOfMonth(today.lengthOfMonth())
        val body = listOf(
            LckSchedulePutRequestDto(
                date = listOf("2022", "06", "23"),
                matches = listOf(
                    LckMatchPutReqDto(
                        startTime = listOf("17", "00"),
                        state = LckMatchState.BEFORE_MATCH,
                        home = LoLTeam.DK,
                        away = LoLTeam.BRO,
                        homeScore = 0,
                        awayScore = 0
                    ), LckMatchPutReqDto(
                        startTime = listOf("20", "00"),
                        state = LckMatchState.BEFORE_MATCH,
                        home = LoLTeam.T1,
                        away = LoLTeam.GEN,
                        homeScore = 0,
                        awayScore = 0
                    )
                )
            ),
            LckSchedulePutRequestDto(
                date = listOf("2022", "06", "24"),
                matches = listOf(
                    LckMatchPutReqDto(
                        startTime = listOf("17", "00"),
                        state = LckMatchState.BEFORE_MATCH,
                        home = LoLTeam.T1,
                        away = LoLTeam.GEN,
                        homeScore = 0,
                        awayScore = 0
                    ), LckMatchPutReqDto(
                        startTime = listOf("20", "00"),
                        state = LckMatchState.BEFORE_MATCH,
                        home = LoLTeam.DK,
                        away = LoLTeam.BRO,
                        homeScore = 0,
                        awayScore = 0
                    )
                )
            )
        )

        // stub
        every {
            restTemplate.exchange<List<LckSchedulePutRequestDto>>(any<String>(), HttpMethod.GET)
        } returns ResponseEntity(body, HttpStatus.OK)
        every { lckMatchRepository.findMatchesBetweenDate(any(), any()) } returns listOf()
        every { lckMatchRepository.deleteAll(any()) } returns Unit
        every { lckMatchRepository.save(any()) } returns LckMatch(
            matchDate = LocalDate.now(),
            startTime = LocalTime.now(),
            matchState = LckMatchState.BEFORE_MATCH,
            home = LoLTeam.GEN,
            away = LoLTeam.T1,
            homeScore = 0,
            awayScore = 0
        )

        // when
        lckService.putLckMatchService(2022, 6)

        // then
        verify(exactly = 1) {
            restTemplate.exchange<List<LckSchedulePutRequestDto>>(any<String>(), HttpMethod.GET)
            lckMatchRepository.findMatchesBetweenDate(startDate, endDate)
            lckMatchRepository.deleteAll(any())
        }
        verify(exactly = 4) {
            lckMatchRepository.save(any())
        }
    }

    @Test
    fun patchLckMatchService() {
        // given
        val dto = listOf(
            LckMatchPatchReqDto(
                state = LckMatchState.SET2,
                homeScore = 1,
                home = "T1",
                awayScore = 0,
                away = "젠지"
            )
        )
        val matches = listOf(
            LckMatch(
                id = 1,
                matchDate = LocalDate.now(),
                startTime = LocalTime.of(17, 0, 0),
                matchState = LckMatchState.SET1,
                home = LoLTeam.T1,
                away = LoLTeam.GEN,
                homeScore = 0,
                awayScore = 0
            )
        )
        val slot = slot<List<LckMatch>>()

        // stub
        every { lckMatchRepository.findTodayMatches() } returns matches
        every { lckMatchRepository.saveAll(capture(slot)) } returns matches

        // when
        lckService.patchLckMatchService(dto)

        // then
        val captured = slot.captured[0]
        assertThat(captured.matchState).isEqualTo(dto.first().state)
        assertThat(captured.homeScore).isEqualTo(dto.first().homeScore)
        assertThat(captured.awayScore).isEqualTo(dto.first().awayScore)
    }

    @Test
    fun getLckWeekMatchService() {
        // given
        val today = LocalDate.now()
        val startDate = today.with(DayOfWeek.MONDAY)
        val endDate = today.with(DayOfWeek.SUNDAY)
        val entities = listOf(LckMatch(
            id = 1,
            matchDate = startDate,
            startTime = LocalTime.now(),
            matchState = LckMatchState.AFTER_MATCH,
            home = LoLTeam.T1,
            homeScore = 2,
            away = LoLTeam.GEN,
            awayScore = 0
        ),LckMatch(
            id = 2,
            matchDate = endDate,
            startTime = LocalTime.now(),
            matchState = LckMatchState.BEFORE_MATCH,
            home = LoLTeam.T1,
            homeScore = 0,
            away = LoLTeam.GEN,
            awayScore = 0
        ))

        // stub
        every { lckMatchRepository.findMatchesBetweenDate(any(), any()) } returns entities

        // when
        val result = lckService.getLckWeekMatchService()

        // then
        verify(exactly = 1) { lckMatchRepository.findMatchesBetweenDate(startDate, endDate) }

        val first = result.weekMatches[0]
        assertThat(result.weekMatches.size).isEqualTo(2)
        assertThat(first.date).isEqualTo(startDate)
        assertThat(first.matches.size).isEqualTo(1)
        assertThat(first.matches[0].startTime).isEqualTo(entities[0].startTime)
        assertThat(first.matches[0].state).isEqualTo(entities[0].matchState.fullName)
        assertThat(first.matches[0].home).isEqualTo(entities[0].home.shortName)
        assertThat(first.matches[0].away).isEqualTo(entities[0].away.shortName)
        assertThat(first.matches[0].homeScore).isEqualTo(entities[0].homeScore)
        assertThat(first.matches[0].awayScore).isEqualTo(entities[0].awayScore)

        if(today == endDate) {
            val second = result.weekMatches[1]
            assertThat(result.todayMatches).isNotNull
            assertThat(second.date).isEqualTo(endDate)
            assertThat(second.matches.size).isEqualTo(1)
            assertThat(second.matches[0].startTime).isEqualTo(entities[1].startTime)
            assertThat(second.matches[0].state).isEqualTo(entities[1].matchState.fullName)
            assertThat(second.matches[0].home).isEqualTo(entities[1].home.shortName)
            assertThat(second.matches[0].away).isEqualTo(entities[1].away.shortName)
            assertThat(second.matches[0].homeScore).isEqualTo(entities[1].homeScore)
            assertThat(second.matches[0].awayScore).isEqualTo(entities[1].awayScore)
        } else {
            assertThat(result.todayMatches).isNull()
        }
    }
}