package com.tkppp.sportresult.kbo.controller

import com.tkppp.sportresult.kbo.dto.KboDayMatchRequestDto
import com.tkppp.sportresult.kbo.dto.KboDayResultResponseDto
import com.tkppp.sportresult.kbo.service.KboDayResultService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/kbo/day")
class KboDayResultController(
    private val kboDayResultService: KboDayResultService
) {

    @GetMapping
    fun returnDayResult(): ResponseEntity<List<KboDayResultResponseDto>>{
        val response = kboDayResultService.getDayResult()
        return ResponseEntity(response, HttpStatus.OK)
    }

    @PutMapping
    fun updateDayMatch(@RequestBody dayMatchData: List<KboDayMatchRequestDto>): ResponseEntity<Any> {
        kboDayResultService.updateDayMatch(dayMatchData)
        return ResponseEntity(HttpStatus.NO_CONTENT)
    }

}