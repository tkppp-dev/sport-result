package com.tkppp.sportresult.exception

import org.springframework.http.HttpStatus

data class ErrorResponseDto(
    val status: HttpStatus,
    val message: String
)