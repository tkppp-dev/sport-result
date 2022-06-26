<template>
  <div class="lck-today-match-wrapper">
    <div class="lck-today-match-title">오늘의 경기</div>
    <lck-match v-if="todayMatches" :matches="todayMatches.matches" />
    <div class="lck-no-game" v-else>
      당일 경기가 없습니다
    </div>
  </div>
</template>

<script>
import LckMatch from './LckMatch.vue'
export default {
  components: { LckMatch },
  props: {
    todayMatches: [Object, null],
  },
}
</script>

<style>
.lck-today-match-title {
  font-weight: bold;
  padding: 8px 0px 12px 0px;
}

.lck-no-game {
  font-size: 15px;
  font-weight: bold;
  padding: 12px 0px;
  border-top: 1px solid #80808099;
  border-bottom: 1px solid #80808099;
}
</style>