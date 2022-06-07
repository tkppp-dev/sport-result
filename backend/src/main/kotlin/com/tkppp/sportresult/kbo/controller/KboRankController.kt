package com.tkppp.sportresult.kbo.controller

import com.tkppp.sportresult.kbo.service.KboRankService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/kbo/rank")
class KboRankController(
    private val kboRankService: KboRankService
) {

    @PutMapping("/")
    fun updateKboRanking(): ResponseEntity<Any>{
        val rankData = kboRankService.getKboRankData()
        rankData?.let { kboRankService.updateKboRank(it) }

        return ResponseEntity(HttpStatus.NO_CONTENT)
    }
}