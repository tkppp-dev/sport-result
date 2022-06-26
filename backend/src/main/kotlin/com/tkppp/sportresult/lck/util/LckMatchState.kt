package com.tkppp.sportresult.lck.util

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonValue

enum class LckMatchState(@JsonValue val fullName: String) {
    BEFORE_MATCH("예정"), AFTER_MATCH("종료"), SET1("1세트"),
    SET2("2세트"), SET3("3세트"), SET4("4세트"), SET5("5세트");

    companion object {
        @JvmStatic
        @JsonCreator
        fun set(state: String) = values().find{ it.fullName == state }
    }
}