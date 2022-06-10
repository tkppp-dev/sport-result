<template>
  <div class="kbo-schedule-container">
    <a class="kbo-schedule-anker" href="https://sports.news.naver.com/kbaseball/schedule/index">일정</a>
  </div>
</template>

<script>
export default {};
</script>

<style>
.kbo-schedule-container {
  width: 92%;
  margin: 0px auto;
}

.kbo-schedule-anker {
  display: block;
  cursor: pointer;
  font-weight: bold;
  margin-top: 25px;
  padding: 8px 0px 12px 0px;
  border: 1px solid #80808099;

  text-decoration: none;
  color: black;
}

.kbo-schedule-anker:hover {
  background-color: #80808099;
}
</style>
