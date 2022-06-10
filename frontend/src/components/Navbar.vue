<template>
  <nav id="nav-wrapper">
    <div class="nav-item-wrapper" :class="{ selected: isKboSelected}">
      <router-link class="nav-item" to="/kbo">KBO</router-link>
    </div>
    <div class="nav-item-wrapper" :class="{ selected: isNbaSelected}">
      <router-link class="nav-item" to="/nba">NBA</router-link>
    </div>
    <div class="nav-item-wrapper" :class="{ selected: isLckSelected}">
      <router-link class="nav-item" to="/lck">LCK</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  data(){
    return {
      isKboSelected: false,
      isNbaSelected: false,
      isLckSelected: false,
    }
  },
  created(){
    const type = this.$route.path.split('/')[1]

    switch(type){
      case 'kbo':
        this.isKboSelected = true
        break
      case 'nba':
        this.isNbaSelected = true
        break
      case 'lck':
        this.isLckSelected = true
        break
      default:
        break
    }
  }
}
</script>

<style>
#nav-wrapper {
  display: flex;
  width: 100%;
  background-color: #384aba;
}

.nav-item-wrapper {
  flex: 1;
  padding: 8px 0px;
}

.selected {
  background-color: rgba(0, 217, 255, 0.325);
}

.nav-item {
  padding: 6px 20px;
  text-decoration: none;
  color: white;
  font-weight: bold;
  font-size: 13px;
}
</style>