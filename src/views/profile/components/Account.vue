<template>
  <el-form 
      ref="updatePwdForm"
      :model="updatePwdForm"
      :rules="updatePwdRules">
    <el-form-item label="账号">
      <el-input v-model.trim="updatePwdForm.account" :disabled="true"/>
    </el-form-item>
    <el-form-item label="原密码" prop="password">
      <el-input v-model.trim="updatePwdForm.password" type="password" placeholder="原密码"/>
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model.trim="updatePwdForm.newPassword" type="password" placeholder="新密码"/>
    </el-form-item>
    <el-form-item style="margin-top:30px;">
      <el-button type="primary" :loading="loading" :disabled="loading" @click="submit">{{ loading ? '修改中...' : '修改密码'}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updatePassword } from "@/api/userService";

export default {
  props: {
    userInfo: {
      type: Object,
      default: () => {
        return {
          account: '',
        }
      }
    }
  },
  data() {
    const validateNewPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('新密码不能为空'));
      }
      if (value == this.updatePwdForm.password) {
        callback(new Error('新密码不能和原密码相同'))
      } else {
        callback()
      }
    };
    return {
      loading: false,
      updatePwdForm : {
        account : '',
        password : '',
        newPassword : '',
      }, 
      updatePwdRules: {
        password: [{ required: true, message: "请输入原密码", trigger: "blur" }],
        newPassword: [{ required: true, validator: validateNewPassword, trigger: "blur" }],
      },
    }
  },
  created() {
    this.updatePwdForm.account = this.userInfo.account;
  },
  methods: {
    submit() {
      this.$refs.updatePwdForm.validate(valid => {
        if (valid) {
          this.loading = true;
          updatePassword(this.updatePwdForm)
            .then((content) => {
              this.$store.dispatch('user/resetStateAction');
              this.$alert('密码更新成功，现在去重新登录', '操作成功', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$router.push({ path: "/login" });
                }
              });
              this.loading = false;
            })
            .catch( error => {
              this.$notify({
                title: "提示",
                type: "info",
                message: error.errorMsg
              });
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
}
</script>