package com.tkppp.sportresult.kbo.controller

import com.tkppp.sportresult.kbo.dto.KboRankResponseDto
import com.tkppp.sportresult.kbo.service.KboRankService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/kbo/rank")
class KboRankController(
    private val kboRankService: KboRankService
) {

    @GetMapping
    fun getKboRanking(): ResponseEntity<List<KboRankResponseDto>> {
        val body = kboRankService.getKboRankList()
        return ResponseEntity(body, HttpStatus.OK)
    }

    @PutMapping
    fun updateKboRanking(): ResponseEntity<Any>{
        val rankData = kboRankService.getKboRankData()
        rankData?.let { kboRankService.updateKboRank(it) }

        return ResponseEntity(HttpStatus.NO_CONTENT)
    }
}