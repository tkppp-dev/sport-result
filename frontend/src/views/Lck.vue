<template>
  <navbar />
  <div class="lck-wrapper">
    <div class="lck-match-container">
      <lck-today-matches :todayMatches="todayMatches" />
      <lck-week-matches class="lck-week-matches" :weekMatches="weekMatches" :noSchedule="noSchedule" />
    </div>
  </div>
</template>

<script>
import LckWeekMatches from '../components/lck/LckWeekMatches.vue';
import Navbar from '../components/Navbar.vue';
import LckTodayMatches from '../components/lck/LckTodayMatches.vue';
import axios from 'axios';

export default {
  components: { Navbar, LckWeekMatches, LckTodayMatches },
  data() {
    return {
      todayMatches: null,
      weekMatches: [],
      noSchedule: false,
    };
  },
  async created() {
    try {
      const res = await axios.get('http://localhost:8080/api/lck/week')
      this.todayMatches = res.data.todayMatches
      this.weekMatches = res.data.weekMatches
      if(this.weekMatches.length == 0) this.noSchedule = true
    } catch (err){
      console.error(err)
    }
  }
};
</script>

<style>
.lck-wrapper {
  width: 100%;
  margin: 12px auto 0px auto;
}

.lck-match-container {
  width: 92%;
  margin: 0px auto;
}

.lck-week-matches {
  margin-top: 15px;
}
</style>
