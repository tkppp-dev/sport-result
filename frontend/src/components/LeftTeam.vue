<template>
  <div class="left-team-wrapper">
    <div class="left-team-name">{{teamName}}</div>
    <div class="left-team-score">{{score}}</div>
  </div>
</template>

<script>
export default {
  props:{
    teamName: String,
    score: Number
  }
}
</script>

<style>
.left-team-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 0px;
}

.left-team-name{
  flex: 1;
  font-weight: bold;
  font-size: 15px;
  color:rgb(56, 74, 186)
}

.left-team-score {
  font-weight: bold;
  font-size: 18px;
}
</style>