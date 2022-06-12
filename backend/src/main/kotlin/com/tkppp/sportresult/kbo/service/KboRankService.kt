package com.tkppp.sportresult.kbo.service

import com.tkppp.sportresult.exception.CustomException
import com.tkppp.sportresult.exception.ErrorCode
import com.tkppp.sportresult.kbo.domain.KboRankRepository
import com.tkppp.sportresult.kbo.dto.KboRankDto
import com.tkppp.sportresult.kbo.dto.KboRankResponseDto
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Service
import org.springframework.web.client.RestClientException
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.exchange
import java.lang.Exception

@Service
class KboRankService(
    private val kboRankRepository: KboRankRepository,
    private val restTemplate: RestTemplate
) {

    fun getKboRankData(): List<KboRankDto>? {
        val url = "http://localhost:3000/api/kbo/rank"

        return try {
            restTemplate.exchange<List<KboRankDto>>(url, HttpMethod.GET, null).body
        } catch (restClientEx: RestClientException) {
            throw CustomException(ErrorCode.CRAWLING_SERVER_REQUEST_ERROR, restClientEx)
        } catch (ex: Exception) {
            throw ex
        }
    }

    fun insertKboRank(kboRankDtos: List<KboRankDto>) {
        kboRankRepository.saveAll(kboRankDtos.map { it.toEntity() })
    }

    fun updateKboRank(kboRankDtos: List<KboRankDto>) {
        val entities = kboRankRepository.findAll()

        if (entities.isEmpty()) insertKboRank(kboRankDtos)
        else {
            val updated = entities.map {
                val rankDto = kboRankDtos[it.ranking - 1]
                it.name = rankDto.name
                it.played = rankDto.played
                it.win = rankDto.win
                it.draw = rankDto.draw
                it.defeat = rankDto.defeat
                it.winRate = rankDto.winRate
                it.gameDiff = rankDto.gameDiff
                it
            }
            kboRankRepository.saveAll(updated)
        }
    }

    fun getKboRankList(): List<KboRankResponseDto> {
        return kboRankRepository.findAll().map { KboRankResponseDto(it) }
    }
}