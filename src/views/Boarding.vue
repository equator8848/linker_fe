<template>
  <div id="container">
    <div id="notice">
      <h2>
        如果管理员开放了自助注册功能，你可以自行注册；如果没有开启自助注册功能，请联系管理员添加用户
      </h2>
    </div>
    <div class="boarding login-info" v-if="isLogin">
      <h2>欢迎您，{{ userInfo.nickName }}</h2>
      <div class="operation-button">
        <el-button type="warning" @click="logout">退出登录</el-button>
        <el-button type="primary" @click="enterConsole">进入控制台</el-button>
      </div>
    </div>
    <div class="boarding" v-else>
      <el-form label-position="top" label-width="80px" :model="userLoginForm" ref="userLoginForm"
               :rules="userLoginFormRules">
        <el-form-item label="登录方式" prop="userIdentificationType" id="login-type">
          <el-radio-group v-model="userLoginForm.userIdentificationType" prop="userIdentificationType">
            <el-radio label="phone">手机登录（默认+86）</el-radio>
            <el-radio label="email">邮箱登录</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账号" prop="userIdentification">
          <el-input v-model="userLoginForm.userIdentification" clearable placeholder="请输入手机号或者邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input v-model="userLoginForm.userPassword" show-password></el-input>
        </el-form-item>
        <div id="identify-code">
          <el-form-item label="验证码" prop="identifyCodeInput">
            <el-input v-model="userLoginForm.identifyCodeInput"></el-input>
          </el-form-item>
          <img alt="这里是验证码" :src="userLoginForm.captchaUrl" id="captcha-image" @click="getCaptcha">
        </div>
        <el-checkbox v-model="userLoginForm.rememberMe">记住我的登录信息</el-checkbox>
        <el-button type="primary" @click="login" style="width: 100%">登录</el-button>
<!--        <div id="user-agreement">登录则认为您已同意<a-->
        <!--            href="#" target="_blank">《用户使用协议》</a>-->
        <!--        </div>-->
      </el-form>
    </div>
  </div>
</template>

<script>
import {useStore} from 'vuex'

export default {
  name: "Boarding",
  components: {},
  data() {
    return {
      userLoginForm: {
        userIdentificationType: "phone",
        userIdentification: '',
        userPassword: '',
        userInfo: null,
        rememberMe: false,
        captchaUrl: "", //密码登录图形验证码
        captchaId: "",
        captchaSecret: "",
        identifyCodeInput: null,
      },
      userLoginFormRules: {
        userIdentificationType: {required: true, message: '请选择登录方式', trigger: 'blur'},
        userIdentification: {required: true, message: '请输入账号', trigger: 'blur'},
        userPassword: {required: true, message: '请输入密码', trigger: 'blur'},
        identifyCodeInput: {required: true, message: '请输入验证码', trigger: 'blur'},
      },
      isLogin: false,
      store: null
    }
  },
  mounted() {
    this.store = useStore()
    const expiredAt = this.store.getters['expiredAt'];
    if (Number(Date.now()) > Number(expiredAt)) {
      this.$notify.warning({
        title: '登录凭证已失效',
        message: '登录信息已失效，请重新登录'
      });
      this.removeUserInfo();
    }
    let userInfo = this.store.getters['userInfo'];
    this.userInfo = userInfo;
    console.log("check login, userInfo: " + userInfo)
    if (userInfo) {
      this.$httpUtil.get('/linker-server/api/v1/user/check-token', {}).then(res => {
        if (res) {
          this.isLogin = true;
        }
      }, res => {
        this.$notify.warning({
          title: '登录凭证已失效',
          message: '登录信息已失效，请重新登录'
        });
        this.getCaptcha();
      });
    } else {
      this.isLogin = false;
      this.getCaptcha();
    }
  },
  methods: {
    /**
     * 保存数据
     * @param storage
     * @param loginData
     */
    saveUserInfo(storage, loginData) {
      storage.setItem('token', loginData.token);
      storage.setItem('user_info', JSON.stringify(loginData.loginUser));
      storage.setItem('expired_at', JSON.stringify(loginData.tokenExpiredAt));
    },
    removeUserInfo() {
      localStorage.clear();
      sessionStorage.clear();
      this.store.commit("clearLoginInfo");
    },
    getCaptcha() {
      this.$httpUtil.get('/linker-server/api/v1/user/captcha', {}).then(res => {
        if (res) {
          let captcha = res.data;
          this.userLoginForm.captchaUrl = captcha.image;
          this.userLoginForm.captchaId = captcha.id;
          this.userLoginForm.captchaSecret = captcha.secret;
        }
      }, res => {
        console.log(res);
      })
    },
    login() {
      this.$httpUtil.jsonPost('/linker-server/api/v1/user/login', {
        userIdentificationType: this.userLoginForm.userIdentificationType,
        userIdentification: this.userLoginForm.userIdentificationType === "email" ? this.userLoginForm.userIdentification : "86#" + this.userLoginForm.userIdentification,
        userPassword: this.userLoginForm.userPassword,
        captchaId: this.userLoginForm.captchaId,
        captchaValue: this.userLoginForm.identifyCodeInput,
        captchaSecret: this.userLoginForm.captchaSecret
      }).then(res => {
        if (res) {
          if (this.userLoginForm.rememberMe) {
            this.saveUserInfo(localStorage, res.data);
          } else {
            this.saveUserInfo(sessionStorage, res.data);
          }
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
    },
    logout() {
      this.userInfo = null;
      this.isLogin = false;
      this.removeUserInfo();
      window.location.reload();
    },
    enterConsole() {
      this.$router.push({
        path: '/home/dashboard',
      })
    },
  }
}
</script>

<style scoped lang="less">
@import "@/assets/style/common.less";

#container {
  min-height: 768px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;

  #notice {
    width: 512px;
    height: 512px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
    .card-item();
    background-color: skyblue;
    color: white;

    a {
      text-decoration: none;
    }
  }

  .boarding {
    width: 512px;
    height: 512px;
    background: linear-gradient(to bottom, #409EFF, skyblue);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-radius: 8px;
    align-items: center;
    color: grey;
    .card-item();

    #identify-code {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    #login-type {
      background-color: white;
      border-radius: 2px;
      padding: 4px;
    }

    #captcha-image {
      margin-left: 4px;
      border-radius: 4px;
      width: 128px;
      height: 100%;
    }

    #user-agreement {
      color: gray;
      margin-top: 4px;

      a {
        text-decoration: none;
      }
    }
  }

  .login-info {
    color: whitesmoke;
  }
}
</style>
