package com.tkppp.sportresult.kbo.domain

import org.springframework.data.jpa.repository.JpaRepository

interface KboRankRepository : JpaRepository<KboRank, Long> {
}