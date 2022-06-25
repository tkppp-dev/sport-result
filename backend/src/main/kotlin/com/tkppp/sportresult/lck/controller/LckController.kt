package com.tkppp.sportresult.lck.controller

import com.tkppp.sportresult.global_dto.MessageResponseDto
import com.tkppp.sportresult.lck.dto.LckMatchPatchReqDto
import com.tkppp.sportresult.lck.dto.LckWeekMatchResDto
import com.tkppp.sportresult.lck.service.LckService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestControllerAdvice
@RequestMapping("/api/lck")
class LckController(
    private val lckService: LckService
) {

    @PutMapping("/schedule")
    fun putLckSchedule(@RequestParam year: Int, @RequestParam month: Int): ResponseEntity<MessageResponseDto> {
        lckService.putLckMatchService(year, month)
        return ResponseEntity(MessageResponseDto("$year-$month LCK 매치 스케줄 업데이트 성공"), HttpStatus.OK)
    }

    @PatchMapping("/day")
    fun patchLckDayMatch(@RequestBody reqBody: List<LckMatchPatchReqDto>): ResponseEntity<MessageResponseDto> {
        lckService.patchLckMatchService(reqBody)
        return ResponseEntity(MessageResponseDto("LCK Day 매치 업데이트 성공"), HttpStatus.OK)
    }

    @GetMapping("/week")
    fun getLckWeekMatch(): ResponseEntity<LckWeekMatchResDto> {
        val dto = lckService.getLckWeekMatchService()
        return ResponseEntity(dto, HttpStatus.OK)
    }
}