<template>
  <div id="container">
    <el-card class="box-card">
      <template #header>
        <div class="card-item">
          <span>{{ currentUsername }}</span>
          <el-button type="primary" @click="changeUsername">修改用户名</el-button>
        </div>
      </template>
      <div class="card-item">
        <span>邮箱：{{ currentUserInfo.email }}</span>
        <el-button type="warning" @click="updatePasswordDialogVisible = true">修改密码</el-button>
      </div>
    </el-card>

    <el-dialog v-model="updatePasswordDialogVisible" title="修改密码">
      <el-form :model="updatePasswordForm" label-position="top" :rules="updatePasswordFormRules"
               ref="updatePasswordForm">
        <el-form-item label="输入当前密码以确认身份" prop="currentPassword">
          <el-input v-model="updatePasswordForm.currentPassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="updatePasswordForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordConfirm">
          <el-input v-model="updatePasswordForm.passwordConfirm" show-password></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="updatePasswordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updatePassword">确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "Me",
  inject: ['reload'],
  data() {
    return {
      updatePasswordDialogVisible: false,
      updatePasswordForm: {
        currentPassword: null,
        password: null,
        passwordConfirm: null
      },
      updatePasswordFormRules: {
        currentPassword: {required: true, message: '请输入当前密码以确认身份', trigger: 'blur'},
        password: {required: true, message: '请输入密码', trigger: 'blur'},
        passwordConfirm: [{
          required: true, message: '请二次确认密码', trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            if (value !== this.updatePasswordForm.password) {
              callback(new Error('两次输入的密码不一致'));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    currentUserInfo() {
      const userInfo = this.$store.getters['userInfo'];
      return userInfo ? userInfo : {};
    },
    currentUsername() {
      const userInfo = this.$store.getters['userInfo'];
      return userInfo ? userInfo.userName : "Linker用户";
    }
  },
  methods: {
    changeUsername() {
      this.$prompt('请输入新的用户名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        this.$httpUtil.urlEncoderPut('/linker-server/api/v1/user/change-username', {
          newUsername: value
        }).then(res => {
          if (res) {
            this.$notify.success({
              title: '成功',
              message: '成功更新用户名'
            });
            const newUserInfo = res.data;
            localStorage.setItem('user_info', JSON.stringify(newUserInfo));
            this.$store.commit("setUserInfo", newUserInfo);
            this.reload();
          }
        }, (res) => {
          console.log(res);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    updatePassword() {
      this.$refs['updatePasswordForm'].validate((valid) => {
        if (valid) {
          if (this.updatePasswordForm.password !== this.updatePasswordForm.passwordConfirm) {
            this.$notify.error({
              title: '错误',
              message: '两次密码输入不一致'
            });
            return;
          }
          this.$httpUtil.jsonPut('/linker-server/api/v1/user/update-user-password', this.updatePasswordForm).then(res => {
            if (res) {
              this.$notify.success({
                title: '成功',
                message: '成功更新密码'
              });
              this.updatePasswordDialogVisible = false;
              this.reload();
            }
          }, (res) => {
            console.log(res);
          });
        } else {
          return false;
        }
      });

    }
  }
}
</script>

<style scoped lang="less">
#container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;

  .card-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .box-card {
    width: 960px;
  }
}

</style>