<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item
        v-for="(item,index) of timeline"
        :key="index"
        :timestamp="item.timestamp"
        placement="top"
      >
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeline: [
        {
          timestamp: this.getDate(this.userInfo.lastLogin),
          title: "最后登录",
          content: "最后登录于：" + this.userInfo.lastLogin
        },
        {
          timestamp: this.getDate(this.userInfo.gmtCreate),
          title: "注册账号",
          content: "账号注册于：" + this.userInfo.gmtCreate
        }
      ]
    };
  },
  props: {
    userInfo: {
      type: Object,
      default: () => {
        return {
          account: "",
          email: "",
          avatar: "",
          roles: "",
          gmtCreate: "",
          lastLogin: ""
        };
      }
    }
  },
  methods: {
    getDate(datetime) {
      const date = new Date(datetime);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    }
  }
};
</script>