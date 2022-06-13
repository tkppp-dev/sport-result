package com.tkppp.sportresult.kbo.dto

import com.tkppp.sportresult.kbo.domain.KboMatch
import com.tkppp.sportresult.kbo.util.KboTeam
import com.tkppp.sportresult.kbo.util.MatchStatus
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.time.LocalDate
import java.time.LocalTime

internal class KboDayResultResponseDtoTest {

    @Test
    fun kboDayResultResponseDtoConstructorTest(){
        // given
        val entity = KboMatch(
            matchDate = LocalDate.of(2022, 12, 6),
            startTime = LocalTime.now(),
            matchStatus = MatchStatus.BEFORE_MATCH,
            home = KboTeam.SSG,
            away = KboTeam.LT,
        )

        // when
        val dto = KboDayResultResponseDto(entity)

        println(dto)
        assertThat(dto.matchDate.length).isEqualTo(8)
        assertThat(dto.matchDate).isEqualTo(dto.getDateString(entity.matchDate))
        assertThat(dto.startTime).isEqualTo(dto.getStartTimeString(entity.startTime!!))
        assertThat(dto.matchStatus).isEqualTo(entity.matchStatus)
        assertThat(dto.matchProgress).isNull()
        assertThat(dto.home).isEqualTo(entity.home?.fullName)
        assertThat(dto.away).isEqualTo(entity.away?.fullName)
        assertThat(dto.homeCode).isEqualTo(entity.home?.code)
        assertThat(dto.awayCode).isEqualTo(entity.away?.code)
        assertThat(dto.homeScore).isEqualTo(entity.homeScore)
        assertThat(dto.awayScore).isEqualTo(entity.awayScore)


    }
}