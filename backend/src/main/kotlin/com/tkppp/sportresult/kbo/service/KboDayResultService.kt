package com.tkppp.sportresult.kbo.service

import com.tkppp.sportresult.kbo.domain.KboMatchRepository
import com.tkppp.sportresult.kbo.dto.KboDayResultResponseDto
import org.springframework.stereotype.Service

@Service
class KboDayResultService(
    private val kboMatchRepository: KboMatchRepository
) {

    fun getDayResult(): List<KboDayResultResponseDto> {
        val entity = kboMatchRepository.findKboDayMatch()
        return entity.map{ KboDayResultResponseDto(it) }
    }

}