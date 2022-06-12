package com.tkppp.sportresult.Integration

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.ninjasquad.springmockk.SpykBean
import com.tkppp.sportresult.kbo.controller.KboRankController
import com.tkppp.sportresult.kbo.domain.KboRankRepository
import com.tkppp.sportresult.kbo.dto.KboRankDto
import com.tkppp.sportresult.kbo.dto.KboRankResponseDto
import com.tkppp.sportresult.kbo.service.KboRankService
import com.tkppp.sportresult.kbo.util.KboTeam
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation::class)
@ActiveProfiles("dev")
class KboRankIntegrationTest(
    @Autowired private val kboRankRepository: KboRankRepository,
    @Autowired private val kboRankController: KboRankController,
    @Autowired private val mvc: MockMvc
) {

    @SpykBean
    private lateinit var kboRankService: KboRankService

    @Test
    @Order(1)
    @DisplayName("KBO 랭크 DB 초기화 테스트")
    fun insertKboRank() {
        // given
        val rankDtos = listOf(KboRankDto(1, KboTeam.SSG, 10, 8, 0, 2, 0.8f, 0.0f))

        // when
        kboRankController.updateKboRanking(rankDtos)

        // then
        val rank = kboRankRepository.findAll()
        verify(exactly = 1) { kboRankService.insertKboRank(any()) }
        assertThat(rank[0].ranking).isEqualTo(1)
        assertThat(rank[0].name).isEqualTo(KboTeam.SSG)
        assertThat(rank[0].played).isEqualTo(10)
        assertThat(rank[0].win).isEqualTo(8)
        assertThat(rank[0].draw).isEqualTo(0)
        assertThat(rank[0].defeat).isEqualTo(2)
        assertThat(rank[0].winRate).isEqualTo(0.8f)
        assertThat(rank[0].gameDiff).isEqualTo(0.0f)
    }

    @Test
    @Order(2)
    @DisplayName("KBO 랭크 DB 업데이트 테스트")
    fun updateKboRank() {
        // given
        val rankDtos = listOf(KboRankDto(1, KboTeam.LT, 12, 8, 0, 4, 0.75f, 0.0f))

        // when
        kboRankController.updateKboRanking(rankDtos)

        // then
        val rank = kboRankRepository.findAll()
        verify(exactly = 0) { kboRankService.insertKboRank(any()) }
        assertThat(rank[0].ranking).isEqualTo(1)
        assertThat(rank[0].name).isEqualTo(KboTeam.LT)
        assertThat(rank[0].played).isEqualTo(12)
        assertThat(rank[0].win).isEqualTo(8)
        assertThat(rank[0].draw).isEqualTo(0)
        assertThat(rank[0].defeat).isEqualTo(4)
        assertThat(rank[0].winRate).isEqualTo(0.75f)
        assertThat(rank[0].gameDiff).isEqualTo(0.0f)
    }

    @Test
    @Order(3)
    @DisplayName("KBO 랭킹 컨트롤러 테스트 - 랭킹 정보 받아오기")
    fun getKboRankData() {
        // when
        val result = mvc.perform(get("/api/kbo/rank"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andReturn()

        val mapper = ObjectMapper().registerKotlinModule()
        val body = mapper.readValue<List<KboRankResponseDto>>(result.response.contentAsString)

        assertThat(body.size).isEqualTo(1)
    }

}