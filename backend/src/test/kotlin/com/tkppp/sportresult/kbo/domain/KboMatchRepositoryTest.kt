package com.tkppp.sportresult.kbo.domain

import com.tkppp.sportresult.kbo.util.KboTeam
import com.tkppp.sportresult.kbo.util.MatchStatus
import org.aspectj.lang.annotation.Before
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.*
import org.springframework.data.repository.findByIdOrNull
import java.time.LocalDate
import java.time.LocalTime


@DataJpaTest
class KboMatchRepositoryTest(
    @Autowired private val kboMatchRepository: KboMatchRepository
) {

    // global given
    private val matchData = KboMatch(
        matchDate = LocalDate.now(),
        startTime = LocalTime.now(),
        matchStatus = MatchStatus.BEFORE_MATCH,
        home = KboTeam.SS,
        away = KboTeam.HH
    )

    @Test
    @DisplayName("매치 정보 저장 테스트")
    fun insertMatchData() {
        // when
        val result = kboMatchRepository.save(matchData)

        // then
        val saved = kboMatchRepository.findByIdOrNull(result.id)
        assertThat(result.id).isEqualTo(saved?.id)
        assertThat(result.home).isEqualTo(saved?.home)
        assertThat(result.away).isEqualTo(saved?.away)
    }

    @Test
    @DisplayName("오늘 경기 정보 조회 테스트")
    fun getDayMatch() {
        // given
        val given = kboMatchRepository.save(matchData)

        // when
        val result = kboMatchRepository.findKboDayMatch()

        // then
        assertThat(result.size).isEqualTo(1)
        assertThat(result[0].id).isEqualTo(given.id)
    }
}