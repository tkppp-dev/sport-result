package com.tkppp.sportresult.Integration

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.tkppp.sportresult.kbo.controller.KboDayResultController
import com.tkppp.sportresult.kbo.controller.KboScheduleController
import com.tkppp.sportresult.kbo.domain.KboMatchRepository
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class KboScheduleIntegrationTest(
    @Autowired private val kboScheduleController: KboScheduleController,
    @Autowired private val kboDayResultController: KboDayResultController,
    @Autowired private val kboMatchRepository: KboMatchRepository
){

    @Test
    @DisplayName("연도별 경기 일정 추가 통합테스트")
    fun saveKboYearlyMachSchedule(){
        kboScheduleController.registerYearlySchedule(2022)

        val result = kboMatchRepository.findAll()
        for (match in result) {
            println("${match.matchDate}, ${match.startTime}, ${match.matchStatus}, ${match.matchProgress}, ${match.home}, ${match.away}, ${match.homeScore}, ${match.awayScore}")
        }

        val dayMatch = kboDayResultController.returnDayResult()
        print(dayMatch.body)
    }

    @Test
    @DisplayName("당일 경기 일정 조회 통합 테스트")
    fun getKboDayMatchResult(){
        val result = kboDayResultController.returnDayResult()
        print(result.body)
    }

    @Serializable
    data class TripleJson (
        val fullname: Triple<String, String, Int>
    )

    @Test
    @DisplayName("JSON 직렬화/역직렬화 테스트 - Kotlinx.serialization")
    fun jsonTest() {
        val me = TripleJson(Triple("Park", "Taekyeong", 26))
        val serialize = Json.encodeToString(me)
        println(serialize)

        val deserialize = Json.decodeFromString<TripleJson>(serialize)
        println(deserialize)
    }

    @Test
    @DisplayName("JSON 직렬화/역직렬화 테스트 - Jackson")
    fun jsonTestWithJackson() {
        val mapper = ObjectMapper().registerKotlinModule()
        val me = TripleJson(Triple("Park", "Taekyeong", 26))
        val serialize = mapper.writeValueAsString(me)
        println(serialize)

        val deserialize = mapper.readValue<TripleJson>(serialize)
        println(deserialize)
    }
}