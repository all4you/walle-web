<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>我的信息</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="userInfo.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <div style="margin-top:10px">哈哈</div>
          <span style="font-size:10px;margin-top:4px;">这里还是我</span>
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ userInfo.account }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>我能做什么</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            你可以修改账号信息，查看账号注册时间、最后登录时间，以及AK/SK的信息
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>瓦力能做什么</span></div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <span>模板管理</span>
            <el-progress :percentage="100" status="success" />
          </div>
          <div class="progress-item">
            <span>群消息发送</span>
            <el-progress :percentage="100" status="success" />
          </div>
          <div class="progress-item">
            <span>页面操作</span>
            <el-progress :percentage="100" status="success"/>
          </div>
          <div class="progress-item">
            <span>开放接口</span>
            <el-progress :percentage="30" />
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
export default {
  components: { PanThumb },
  props: {
    userInfo: {
      type: Object,
      default: () => {
        return {
          account: '',
          email: '',
          avatar: '',
          roles: '',
          gmtCreate: '',
          lastLogin: '',
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}
.text-muted {
  color: #777;
}
.user-profile {
  .user-name {
    font-weight: bold;
  }
  .box-center {
    padding-top: 10px;
  }
  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }
  .box-social {
    padding-top: 30px;
    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }
  .user-follow {
    padding-top: 20px;
  }
}
.user-bio {
  margin-top: 20px;
  color: #606266;
  span {
    padding-left: 4px;
  }
  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;
    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}

.progress-item {
    margin-bottom:10px;
}
</style>