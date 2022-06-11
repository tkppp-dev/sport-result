package com.tkppp.sportresult.kbo.service

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import java.time.LocalTime

@SpringBootTest
internal class KboSchedulingServiceTest(
    @Autowired private val kboSchedulingService: KboSchedulingService
) {

    @Test
    fun constructorTest() {
        assertThat(kboSchedulingService.dayMatchStart)
            .isEqualTo(LocalTime.of(17, 0, 0))

        assertThat(kboSchedulingService.initialScheduler?.isDone)
            .isEqualTo(false)
    }

}