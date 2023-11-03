<template>
  <h1 style="text-align: center">快捷登录...</h1>
</template>

<script>
import {useStore} from "vuex";

export default {
  name: "LoginByToken",
  mounted() {
    this.store = useStore();
    let token = this.$route.params.token;
    this.getUserInfoByToken(token);
  },
  methods: {
    saveUserInfo(storage, loginData) {
      storage.setItem('token', loginData.token);
      storage.setItem('user_info', JSON.stringify(loginData.loginUser));
      storage.setItem('expired_at', JSON.stringify(loginData.tokenExpiredAt));
    },
    getUserInfoByToken(token) {
      this.$httpUtil.get('/linker-server/api/v1/user/user-info-by-token', {
        token
      }).then(res => {
        if (res) {
          this.saveUserInfo(sessionStorage, res.data);
          this.store.commit("setLoginInfo", res.data);
          this.$notify.success({
            title: '欢迎使用',
            message: '登录成功',
            duration: 1500
          });
          setTimeout(() => {
            this.$router.push({
              path: '/home/dashboard',
            })
          }, 1500)
        }
      }, res => {
        console.log(res);
      });
    }
  }
}
</script>

<style scoped>

</style>