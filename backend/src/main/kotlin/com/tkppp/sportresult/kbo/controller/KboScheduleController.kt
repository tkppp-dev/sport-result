package com.tkppp.sportresult.kbo.controller

import com.tkppp.sportresult.kbo.service.KboScheduleService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/kbo/schedule")
class KboScheduleController(
    private val kboScheduleService: KboScheduleService
) {

    @PostMapping("/{year}")
    fun registerYearlySchedule(@PathVariable year: Int): ResponseEntity<Any>{
        val response = kboScheduleService.getMatchSchedule(year)
        if(!response.isNullOrEmpty()) kboScheduleService.saveMatchSchedule(response)

        return ResponseEntity(HttpStatus.NO_CONTENT)
    }


}