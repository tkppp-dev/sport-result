<template>
  <div class="lck-match-wrapper">
    <div class="lck-match-item-wrapper" v-for="(match, idx) in matches" :key="idx">
      <left-team class="lck-match-item" :teamName="match.home" :score="match.homeScore" />
      <div class="lck-match-item lck-match-state">{{match.state}}</div>
      <right-team class="lck-match-item" :teamName="match.away" :score="match.awayScore" />
    </div>
  </div>
</template>

<script>
import LeftTeam from '../LeftTeam.vue';
import RightTeam from '../RightTema.vue';
export default {
  components: { LeftTeam, RightTeam },
  props: {
    matches: Object
  }
};
</script>

<style>
.lck-match-wrapper {
  border-top: 1px solid #80808099;
}
.lck-match-item-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 4px 0px;
  border-bottom: 1px solid #8080804d;
}

.lck-match-item{
  flex: 1;
}

.lck-match-state {
  font-size: 15px;
  font-weight: bold;
  color: rgb(206, 55, 49);
}
</style>
