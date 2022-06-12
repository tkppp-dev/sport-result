<template>
  <div class="today-match-container">
    <div class="today-match-title">경기 결과</div>
    <div class="today-match-wrapper" v-for="(match, idx) in matches" :key="idx">
      <left-team
        class="today-match-item"
        :teamName="match.home"
        :score="match.homeScore"
      />
      <div class="today-match-item">
        <div class="today-match-state">{{ match.matchProgress  }}</div>
        <a
          class="today-match-record"
          v-if="
            match.matchProgress != '경기취소' &&
            match.matchProgress != '경기전'
          "
          :href="`https://m.sports.naver.com/game/${match.matchDate}${match.homeCode}${match.awayCode}0${match.matchDate.slice(0,4)}/record`"
        >
          기록
        </a>
      </div>
      <right-team
        class="today-match-item"
        :teamName="match.away"
        :score="match.awayScore"
      />
    </div>
    <div class="today-match-wrapper" v-if="noMatch">
      오늘 경기가 없습니다
    </div>
  </div>
</template>

<script>
import LeftTeam from './LeftTeam.vue';
import RightTeam from './RightTema.vue';

export default {
  components: { LeftTeam, RightTeam },
  props: {
    matches: Array,
  },
  computed: {
    noMatch(){
      if(this.matches == null){
        return false
      } else {
        if(this.matches.length == 0){
          return true
        } else{
          return false
        }
      }
    }
  }, 
};
</script>

<style>
.today-match-container {
  width: 92%;
  margin: 0px auto;
}

.today-match-title {
  font-weight: bold;
  padding: 8px 0px 12px 0px;
  border-bottom: 1px solid #80808099;
}

.today-match-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 9px 0px;
}

.today-match-wrapper:not(:last-of-type) {
  border-bottom: 1px solid rgba(128, 128, 128, 0.3);
}

.today-match-wrapper:last-of-type {
  border-bottom: 1px solid #80808099;
}

.today-match-item {
  flex: 1;
}

.today-match-state {
  font-weight: bold;
  font-size: 13px;
}

.today-match-state {
  color: rgb(206, 55, 49);
}

.today-match-record {
  display: inline-block;
  margin-top: 3px;
  padding: 1px 8px;
  font-size: 11px;
  border: 1px solid rgba(128, 128, 128, 0.6);
  text-decoration: none;
  color: black;
}
</style>
