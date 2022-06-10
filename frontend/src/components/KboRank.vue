<template>
  <div class="kbo-rank-container">
    <div class="kbo-rank-title">순위</div>
    <table class="kbo-rank-table">
      <colgroup>
        <col width="10%" />
        <col width="15%" />
        <col width="10%" />
        <col width="10%" />
        <col width="10%" />
        <col width="10%" />
        <col width="15%" />
        <col width="15%" />
      </colgroup>
      <tr class="kbo-rank-header">
        <th class="kbo-rank-header-item">순위</th>
        <th class="kbo-rank-header-item">팀명</th>
        <th class="kbo-rank-header-item">경기</th>
        <th class="kbo-rank-header-item">승</th>
        <th class="kbo-rank-header-item">무</th>
        <th class="kbo-rank-header-item">패</th>
        <th class="kbo-rank-header-item">승률</th>
        <th class="kbo-rank-header-item">게임차</th>
      </tr>
      <tr class="kbo-rank-row" v-for="(rankData, idx) in ranks" :key="idx">
        <td class="kbo-rank-item">{{rankData.rank}}</td>
        <td class="kbo-rank-item kbo-rank-team">{{rankData.name}}</td>
        <td class="kbo-rank-item">{{rankData.played}}</td>
        <td class="kbo-rank-item">{{rankData.win}}</td>
        <td class="kbo-rank-item">{{rankData.draw}}</td>
        <td class="kbo-rank-item">{{rankData.defeat}}</td>
        <td class="kbo-rank-item">{{rankData.winRate}}</td>
        <td class="kbo-rank-item">{{rankData.gameDiff}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    ranks: Array
  }
};
</script>

<style>
.kbo-rank-container {
  width: 92%;
  margin: 0px auto;
}

.kbo-rank-title {
  font-weight: bold;
  padding: 8px 0px 12px 0px;
  border-bottom: 1px solid #80808099;
}

.kbo-rank-table {
  width: 100%;
  table-layout: fixed;
  border-bottom: 1px solid #80808099;
  padding: 3px 0px;
}

.kbo-rank-header-item {
  padding-top: 3px 0px;
  font-size: 15px;
}

.kbo-rank-item {
  font-size: 13px;
  font-weight: bold;
  padding: 3px 0px;
}

.kbo-rank-team {
  color: #384aba;
}
</style>
