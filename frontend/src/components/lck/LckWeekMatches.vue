<template>
  <div class="lck-week-match-wrapper">
    <div class="lck-week-match-title">주간 경기 일정</div>
    <div v-if="!noSchedule">
      <div
        class="lck-week-match"
        v-for="(weekMatch, idx) in weekMatches"
        :key="idx"
      >
        <div class="lck-match-date">{{ weekMatch.date }}</div>
        <LckMatch :matches="weekMatch.matches" />
      </div>
    </div>
    <div v-else>
      <div class="lck-no-game lck-week-no-game">주중 경기가 없습니다</div>
    </div>
  </div>
</template>

<script>
import LckMatch from './LckMatch.vue';
export default {
  components: { LckMatch },
  props: {
    weekMatches: Object,
    noSchedule: Boolean,
  },
};
</script>

<style>
.lck-week-match-title {
  font-weight: bold;
  padding: 8px 0px 4px 0px;
}
.lck-match-date {
  padding: 8px 0px;
  font-size: 15px;
  font-weight: bold;
}
.lck-week-no-game {
  margin-top: 8px;
}
</style>
