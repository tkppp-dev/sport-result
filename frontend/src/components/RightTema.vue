<template>
  <div class="right-team-wrapper">
    <div class="right-team-score">{{ score }}</div>
    <div class="right-team-name">{{ teamName }}</div>
  </div>
</template>

<script>
export default {
  props: {
    teamName: String,
    score: Number,
  },
};
</script>

<style>
.right-team-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 6px 0px;
}

.right-team-score {
  font-weight: bold;
  font-size: 18px;
}

.right-team-name {
  flex: 1;
  font-weight: bold;
  font-size: 15px;
  color: rgb(56, 74, 186);
}
</style>
