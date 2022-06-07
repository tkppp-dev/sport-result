package com.tkppp.sportresult.Integration

import com.ninjasquad.springmockk.SpykBean
import com.tkppp.sportresult.kbo.controller.KboRankController
import com.tkppp.sportresult.kbo.domain.KboRankRepository
import com.tkppp.sportresult.kbo.service.KboRankService
import io.mockk.verify
import org.junit.jupiter.api.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation::class)
class KboRankIntegrationTest(
    @Autowired private val kboRankRepository: KboRankRepository,
    @Autowired private val kboRankController: KboRankController
) {

    @SpykBean
    private lateinit var kboRankService: KboRankService

    @Test
    @Order(1)
    @DisplayName("KBO 랭크 DB 초기화 테스트")
    fun insertKboRank() {
        // when
        kboRankController.updateKboRanking()

        // then
        val rank = kboRankRepository.findAll()
        verify(exactly = 1) { kboRankService.insertKboRank(any()) }
        rank.map{
            println("${it.rank} ${it.name.fullName} ${it.win} ${it.draw} ${it.defeat} ${it.winRate} ${it.gameDiff}")
        }
    }

    @Test
    @Order(2)
    @DisplayName("KBO 랭크 DB 업데이트 테스트")
    fun updateKboRank() {
        // when
        kboRankController.updateKboRanking()

        // then
        val rank = kboRankRepository.findAll()
        verify(exactly = 0) { kboRankService.insertKboRank(any()) }
        rank.map{
            println("${it.rank} ${it.name.fullName} ${it.win} ${it.draw} ${it.defeat} ${it.winRate} ${it.gameDiff}")
        }
    }


}