<template>
  <div class="admin-auth-wrapper">
    <div class="admin-label">ID</div>
    <input type="text" v-model="id" />
    <div class="admin-label">Password</div>
    <input type="password" v-model="password" />
    <br />
    <button class="admin-label" @click="submit">인증</button>
  </div>
  <div class="admin-main">
    <div class="admin-item">
      <div class="admin-item-container">
        <div class="admin-item-wrapper">
          <div class="admin-label">년</div>
          <input type="number" min="2022" max="3000" v-model="kboYear" />
        </div>
        <div class="admin-item-wrapper">
          <div class="admin-label">월</div>
          <input type="number" min="1" max="12" v-model="kboMonth" />
        </div>
      </div>
      <button class="admin-label admin-button" :disabled="!isAuthenticated" @click="updateKboSchedule">
        KBO 스케줄 업데이트
      </button>
    </div>
    <div class="admin-item">
      <div class="admin-item-container">
        <div class="admin-item-wrapper">
          <div class="admin-label">년</div>
          <input type="number" min="2022" max="3000" v-model="lolYear" />
        </div>
        <div class="admin-item-wrapper">
          <div class="admin-label">월</div>
          <input type="number" min="1" max="12" v-model="lolMonth" />
        </div>
      </div>
      <button class="admin-label admin-button" :disabled="!isAuthenticated" @click="updateLolSchedule">
        LOL 스케줄 업데이트
      </button>
    </div>
    <button class="admin-label admin-button" :disabled="!isAuthenticated" @click="updateKboRanking">
      KBO 랭킹 업데이트
    </button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data: function () {
    return {
      id: '',
      password: '',
      isAuthenticated: false,
      kboYear: new Date().getFullYear(),
      kboMonth: new Date().getMonth() + 1,
      lolYear: new Date().getFullYear(),
      lolMonth: new Date().getMonth() + 1,
    }
  },
  methods: {
    async submit() {
      try {
        await axios.post('/api/auth', {
          id: this.id,
          password: this.password,
        })
        this.isAuthenticated = true
        alert('인증 성공')
      } catch (err) {
        alert('인증 실패')
      }
    },
    async updateKboSchedule() {
      try {
        await axios.put(`/api/kbo/schedule?year=${this.kboYear}&month=${this.kboMonth}`)
        alert(`${this.kboYear}-${this.kboMonth} KBO 스케줄 갱신 성공`)
      } catch (err) {
        alert('갱신 실패')
      }
    },
    async updateLolSchedule() {
      try {
        await axios.put(`/api/lol/schedule?year=${this.lolYear}&month=${this.lolMonth}`)
        alert(`${this.lolYear}-${this.lolMonth} LOL 스케줄 갱신 성공`)
      } catch (err) {
        alert('갱신 실패')
      }
    },
    async updateKboRanking() {
      try {
        await axios.put('/api/kbo/rank')
        alert(`KBO 랭킹 갱신 성공`)
      } catch (err) {
        alert('갱신 실패')
      }
    },
  },
}
</script>

<style>
.admin-label {
  margin: 15px 0 0 0;
  font-weight: bold;
}

.admin-main {
  margin-top: 20px;
}
.admin-item-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.admin-item-wrapper {
  margin: 0px 5px;
}
.admin-button {
  width: 140px;
}
</style>
