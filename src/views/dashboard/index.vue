<template>
  <div class="dashboard-container">
    <div class="dashboard-text">账号: {{ userInfo.account }}</div>
    <div class="dashboard-text">accessKey: {{ userInfo.accessKey }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'


export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
