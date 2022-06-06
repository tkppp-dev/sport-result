package com.tkppp.sportresult.kbo.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.tkppp.sportresult.kbo.domain.KboMatchRepository
import com.tkppp.sportresult.kbo.dto.KboMatchResponseDto
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.exchange
import java.lang.Exception
import java.time.LocalDate

@Service
class KboScheduleService(
    private val kboMatchRepository: KboMatchRepository,
    private val restTemplate: RestTemplate,
) {

    fun getMatchSchedule(year: Int): List<List<KboMatchResponseDto>>? {
        val url = "http://localhost:3000/api/kbo/$year"

        return try {
            restTemplate.exchange<List<List<KboMatchResponseDto>>>(url, HttpMethod.GET, null).body
        } catch (ex: Exception) {
            throw Exception(ex)
        }
    }

    fun saveMatchSchedule(schedules: List<List<KboMatchResponseDto>>) {
        for(monthSchedules in schedules) {
            for(dateSchedules in monthSchedules){
                val (year, month, day) = dateSchedules.matchDate
                val date = LocalDate.of(year, month, day)

                for(match in dateSchedules.matchInfo){
                    kboMatchRepository.save(match.toEntity(date))
                }
            }
        }
    }

}