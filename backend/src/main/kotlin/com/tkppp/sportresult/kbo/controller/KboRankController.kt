package com.tkppp.sportresult.kbo.controller

import com.tkppp.sportresult.kbo.dto.KboRankDto
import com.tkppp.sportresult.kbo.dto.KboRankResponseDto
import com.tkppp.sportresult.kbo.service.KboRankService
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/kbo/rank")
class KboRankController(
    private val kboRankService: KboRankService
) {

    private val logger = LoggerFactory.getLogger(KboRankController::class.java)

    @GetMapping
    fun getKboRanking(): ResponseEntity<List<KboRankResponseDto>> {
        val body = kboRankService.getKboRankList()
        return ResponseEntity(body, HttpStatus.OK)
    }

    @PutMapping
    fun updateKboRanking(@RequestBody kboRankDtos: List<KboRankDto>): ResponseEntity<Any> {
        kboRankService.updateKboRank(kboRankDtos)
        logger.info("KBO ranking update success")

        return ResponseEntity(HttpStatus.NO_CONTENT)
    }
}