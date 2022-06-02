package com.tkppp.sportresult.exception

import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalControllerExceptionHandler {
    private val logger = LoggerFactory.getLogger(GlobalControllerExceptionHandler::class.java)

    @ExceptionHandler(value = [RuntimeException::class])
    fun handlingUnexpectedException(ex: Exception): ResponseEntity<ErrorResponseDto> {
        val errorCode = ErrorCode.INTERNAL_SERVER_ERROR
        logger.error("${ex.message}", ex)
        return ResponseEntity(ErrorResponseDto(errorCode.status, errorCode.message), errorCode.status)
    }
}