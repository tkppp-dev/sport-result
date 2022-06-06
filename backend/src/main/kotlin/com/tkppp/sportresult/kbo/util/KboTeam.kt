package com.tkppp.sportresult.kbo.util

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonValue

enum class KboTeam(@JsonValue val fullName: String, val code: String){
    SS("삼성", "SS"), KW("키움", "WO"), NX("넥센", "WO"),
    HH("한화", "HH"), LG("LG",  "LG"), LT("롯데", "LT"),
    SSG("SSG", "SK"), SK("SK", "SK"), HT("KIA", "HT"),
    OB("두산", "OB"), NC("NC", "NC"), KT("KT", "KT");

    companion object {
        @JvmStatic
        @JsonCreator
        fun set(team: String) = values().find { it.fullName == team }
    }
}