package com.tkppp.sportresult.kbo.service

import com.tkppp.sportresult.exception.CustomException
import com.tkppp.sportresult.kbo.domain.KboRank
import com.tkppp.sportresult.kbo.domain.KboRankRepository
import com.tkppp.sportresult.kbo.dto.KboRankDto
import com.tkppp.sportresult.kbo.util.KboTeam
import io.mockk.confirmVerified
import io.mockk.junit5.MockKExtension
import io.mockk.mockk
import io.mockk.every
import io.mockk.impl.annotations.SpyK
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.client.ResourceAccessException
import org.springframework.web.client.RestClientException
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.exchange

@ExtendWith(MockKExtension::class)
class KboRankServiceTest {

    private val kboRankRepository = mockk<KboRankRepository>(relaxed = true)
    private val restTemplate = mockk<RestTemplate>()

    @SpyK
    private var kboRankService = KboRankService(kboRankRepository, restTemplate)

    @Test
    @DisplayName("랭킹 정보가 없는 초기 상태일때 DB 데이터 삽입 테스트")
    fun updateKboRank_initializeTest() {
        // given
        val rankDtos = listOf(KboRankDto(1, KboTeam.SSG, 10, 8, 0, 2, 0.8f, 0.0f))
        // stub
        every { kboRankRepository.findAll() } returns listOf()
        every { kboRankRepository.saveAll(any<List<KboRank>>()) } returns rankDtos.map { it.toEntity() }

        // when
        kboRankService.updateKboRank(rankDtos)

        // then
        verify(exactly = 1) {
            kboRankRepository.findAll()
            kboRankRepository.saveAll(any<List<KboRank>>())
        }

        verify {    // 모킹한 메소드 말고 테스트할 클래스의 단순 메소드 호출 여부 확인은 spy 를 사용하면 된다
            kboRankService.updateKboRank(rankDtos)
            kboRankService.insertKboRank(rankDtos)
        }

        confirmVerified(kboRankService)
    }

    @Test
    @DisplayName("랭크 DB 삽입 메소드 테스트")
    fun insertKboRank_test() {
        // given
        val rankDtos = listOf(KboRankDto(1, KboTeam.SSG, 10, 8, 0, 2, 0.8f, 0.0f))
        // stub
        every { kboRankRepository.saveAll(any<List<KboRank>>()) } returns rankDtos.map { it.toEntity() }

        // when
        kboRankService.insertKboRank(rankDtos)

        // then
        verify(exactly = 1) { kboRankRepository.saveAll(any<List<KboRank>>()) }
    }

    @Test
    @DisplayName("랭킹 정보가 존재할때 DB 데이터 업데이트 테스트")
    fun updateKboRank_updateTest() {
        // given
        val rankDtos = listOf(KboRankDto(1, KboTeam.SSG, 10, 8, 0, 2, 0.8f, 0.0f))
        // stub
        every { kboRankRepository.findAll() } returns rankDtos.map { it.toEntity() }
        every { kboRankRepository.saveAll(any<List<KboRank>>()) } returns rankDtos.map { it.toEntity() }

        // when
        kboRankService.updateKboRank(rankDtos)

        // then
        verify(exactly = 0) {
            kboRankService.insertKboRank(rankDtos)
        }

        verify(exactly = 1) {
            kboRankRepository.findAll()
            kboRankRepository.saveAll(any<List<KboRank>>())
        }

        verify {    // 모킹한 메소드 말고 테스트할 클래스의 단순 메소드 호출 여부 확인은 spy 를 사용하면 된다
            kboRankService.updateKboRank(rankDtos)
        }

        confirmVerified(kboRankService)
    }

    @Test
    @DisplayName("랭킹 정보 크롤링 서버에서 받아오기 테스트 - 요청 성공")
    fun getKboRankData_success() {
        // stub
        every {
            restTemplate.exchange<List<KboRankDto>>(
                any<String>(),
                any(),
                null
            )
        } returns ResponseEntity<List<KboRankDto>>(listOf(), HttpStatus.OK)

        // when
        val result = kboRankService.getKboRankData()

        verify(exactly = 1) { restTemplate.exchange<List<KboRankDto>>(any<String>(), any(), null) }
        assertThat(result?.size).isEqualTo(0)
    }

    @Test
    @DisplayName("랭킹 정보 크롤링 서버에서 받아오기 테스트 - 요청 실패")
    fun getKboRankData_fail() {
        // stub
        every {
            restTemplate.exchange<List<KboRankDto>>(
                any<String>(),
                any(),
                null
            )
        } throws ResourceAccessException("요청 실패 스텁")

        // when
        val ex = assertThrows<CustomException> {
            kboRankService.getKboRankData()
        }

        verify(exactly = 1) { restTemplate.exchange<List<KboRankDto>>(any<String>(), any(), null) }
        assertThat(ex).isInstanceOf(CustomException::class.java)
        assertThat(ex.message).isEqualTo("org.springframework.web.client.ResourceAccessException: 요청 실패 스텁")
    }
}