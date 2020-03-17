<template>
  <div class="app-container">
    <div v-if="userInfo">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :userInfo="userInfo" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="账号设置" name="account">
                <account :userInfo="userInfo" />
              </el-tab-pane>
              <el-tab-pane label="时间线" name="timeline">
                <timeline :userInfo="userInfo" />
              </el-tab-pane>
              <el-tab-pane label="安全设置" name="security">
                <security :userInfo="userInfo" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Account from './components/Account'
import Timeline from './components/Timeline'
import Security from './components/Security'
export default {
  name: 'Profile',
  components: { UserCard, Account, Timeline, Security },
  data() {
    return {
      activeTab: 'account'
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'avatar',
    ])
  },
  created() {
    this.setAvatar()
  },
  methods: {
    setAvatar() {
        this.userInfo.avatar = this.avatar
    }
  }
}
</script>