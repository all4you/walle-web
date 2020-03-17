<template>
  <el-form>
    <el-form-item label="账号">
      <el-input v-model.trim="userInfo.account" :disabled="true" />
    </el-form-item>
    <el-form-item label="AccessKey">
      <el-input v-model.trim="userInfo.accessKey" :disabled="true" />
    </el-form-item>
    <el-form-item label="SecurityKey">
      <el-input v-model="securityKey" :disabled="true">
        <el-button
          slot="append"
          type="primary"
          :icon="show ? 'el-icon-unlock' : 'el-icon-lock'"
          @click="toggleSK"
        ></el-button>
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { getSecurityKey } from "@/api/userService";

export default {
  data() {
    return {
      securityKey: "************",
      show: false
    };
  },
  props: {
    userInfo: {
      type: Object,
      default: () => {
        return {
          account: "",
          accessKey: ""
        };
      }
    }
  },
  methods: {
    validatePassword(value){
      if (value == undefined || value.length < 1) {
        return '密码不能为空';
      } else {
        return true;
      }
    },
    toggleSK() {
      // 如果当前已经显示了SK，则点击之后要隐藏
      if (this.show) {
        this.show = false;
        this.securityKey = "************";
      } else {
        this.$prompt('请输入你的密码以验证身份', '身份验证', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType : 'password',
          inputValidator: this.validatePassword,
        }).then(({ value }) => {
          getSecurityKey(value).then(response => {
            if (response.success) {
              this.securityKey = response.content;
              this.show = true;
            } else {
              this.$notify({
                title: "操作失败(" + response.errorCode + ")",
                type: "error",
                message: response.errorMsg
              });
            }
          });
        }).catch(() => {

        });
      }
    }
  }
};
</script>