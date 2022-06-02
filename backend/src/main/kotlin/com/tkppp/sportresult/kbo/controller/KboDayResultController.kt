package com.tkppp.sportresult.kbo.controller

import com.tkppp.sportresult.kbo.dto.KboDayResultResponseDto
import com.tkppp.sportresult.kbo.service.KboDayResultService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/kbo")
class KboDayResultController(
    private val kboDayResultService: KboDayResultService
) {

    @GetMapping("/day")
    fun returnDayResult(): ResponseEntity<List<KboDayResultResponseDto>>{
        val response = kboDayResultService.getDayResult()
        return ResponseEntity(response, HttpStatus.OK)
    }

}