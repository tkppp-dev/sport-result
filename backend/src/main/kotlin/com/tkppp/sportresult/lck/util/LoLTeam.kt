package com.tkppp.sportresult.lck.util

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonValue

enum class LoLTeam(@JsonValue val fullName: String, val shortName: String) {
    T1("T1", "T1"), GEN("젠지", "젠지"),
    DK("담원 기아", "담원 기아"), DRX("DRX", "DRX"),
    LSB("리브 샌드박스", "리브 샌박"), KT("KT 롤스터", "KT"),
    HLE("한화생명e스포츠", "한화생명"), KDF("광동 프릭스", "광동"),
    NS("농심 레드포스", "농심"), BRO("프레딧 브리온", "프레딧"),
    TBD("TBD", "TBD");

    companion object {
        @JvmStatic
        @JsonCreator
        fun set(team: String) = values().find { it.fullName == team }
    }
}