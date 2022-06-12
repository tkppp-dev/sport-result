package com.tkppp.sportresult.exception

class CustomException(val errorCode: ErrorCode, realEx: Exception) : RuntimeException(realEx) {
}