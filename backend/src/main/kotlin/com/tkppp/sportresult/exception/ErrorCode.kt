package com.tkppp.sportresult.exception

import org.springframework.http.HttpStatus

enum class ErrorCode(val status: HttpStatus, val message: String) {

    // 500 Internal Server Error
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "요청 처리중 예상치 못한 에러가 발생했습니다"),
    CRAWLING_SERVER_REQUEST_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "크롤링 서버로부터 데이터를 받는데 실패했습니다."),
    CRAWLING_SERVER_CONNECTION_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "크롤링 서버와의 연결이 되어있지 않습니다.")

}