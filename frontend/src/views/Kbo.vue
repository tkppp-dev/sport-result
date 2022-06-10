<template>
  <navbar />
  <main class="kbo-wrapper">
    <today-match :matches="todayMatches" />
    <kbo-rank class="kbo-content" :ranks="kboRank" />
    <kbo-schedule class="kbo-content" />
  </main>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import KboRank from '../components/KboRank.vue';
import TodayMatch from '../components/TodayMatch.vue';
import KboSchedule from '../components/KboSchedule.vue';
import axios from 'axios';

export default {
  components: { Navbar, TodayMatch, KboRank, KboSchedule },
  data() {
    return {
      todayMatches: null,
      kboRank: null,
    };
  },
  async created() {
    try {
      const res1 = await axios.get('/api/kbo/day')
      const res2 = await axios.get('/api/kbo/rank');

      this.todayMatches = res1.data
      this.kboRank = res2.data
    } catch (err) {
      console.error(err);
    }
  },
};
</script>

<style>
.kbo-wrapper {
  width: 100%;
  margin: 12px auto 0px auto;
}

.kbo-today-match-wrapper {
  width: 92%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.kbo-content {
  margin-top: 15px;
}
</style>
