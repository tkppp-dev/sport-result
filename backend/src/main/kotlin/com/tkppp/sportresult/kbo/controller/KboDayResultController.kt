package com.tkppp.sportresult.kbo.controller

import com.tkppp.sportresult.kbo.dto.KboDayMatchRequestDto
import com.tkppp.sportresult.kbo.dto.KboDayResultResponseDto
import com.tkppp.sportresult.kbo.service.KboDayResultService
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/kbo/day")
class KboDayResultController(
    private val kboDayResultService: KboDayResultService
) {

    private val logger = LoggerFactory.getLogger(KboDayResultController::class.java)

    @GetMapping
    fun returnDayResult(): ResponseEntity<List<KboDayResultResponseDto>>{
        val response = kboDayResultService.getDayResult()
        return ResponseEntity(response, HttpStatus.OK)
    }

    @PutMapping
    fun updateDayMatch(@RequestBody dayMatchData: List<KboDayMatchRequestDto>): ResponseEntity<Any> {
        kboDayResultService.updateDayMatch(dayMatchData)
        val now = LocalDateTime.now()
        logger.info("KBO day match result update success")
        return ResponseEntity(HttpStatus.NO_CONTENT)
    }

}