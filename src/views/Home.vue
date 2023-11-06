<template>
  <div id="container">
    <div id="menu">
      <el-menu
          active-text-color="#ffd04b"
          background-color="#409EFF"
          class="el-menu-vertical-demo"
          :default-active="activeIndex"
          text-color="#fff"
          router
          mode="horizontal"
          @select="handleSelect"
          @open="handleOpen"
          @close="handleClose">
        <div id="logo">
          <router-link to="/boarding"><img src="../assets/logo.png"></router-link>
        </div>
        <el-menu-item index="/home/dashboard">
          <el-icon>
            <Odometer/>
          </el-icon>
          <span>仪表盘</span>
        </el-menu-item>

        <el-sub-menu index="instance">
          <template #title>
            <el-icon>
              <MostlyCloudy/>
            </el-icon>
            <span>实例管理</span>
          </template>
          <el-menu-item index="/home/imageMarket">镜像市场</el-menu-item>
          <el-menu-item index="/home/instanceList">实例列表</el-menu-item>
          <el-menu-item index="/home/instanceVolumeList">数据存储卷列表</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/home/operationHistory">
          <el-icon>
            <Operation/>
          </el-icon>
          <span>操作日志</span>
        </el-menu-item>

        <el-sub-menu index="user">
          <template #title>
            <el-icon>
              <WindPower/>
            </el-icon>
            <span>用户中心</span>
          </template>
          <el-menu-item index="/home/me">个人信息</el-menu-item>
          <el-menu-item index="/home/help">用户手册</el-menu-item>
          <el-menu-item index="/home/workOrder">提交工单</el-menu-item>
        </el-sub-menu>
        <el-popover trigger="hover" placement="bottom" :width="120" :hide-after="300">
          <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
            <el-button size="small" type="warning" @click="handleLogout">退出登录</el-button>
          </div>
          <template #reference>
            <el-button type="primary">{{ userInfo.nickName }}</el-button>
          </template>
        </el-popover>
      </el-menu>
    </div>
    <div id="main">
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" :key="$route.fullPath"/>
        </transition>
      </router-view>
    </div>
    <el-dialog v-model="wxQrCodeVisible" title="微信扫码绑定微信账号">
      <div style="display: flex;flex-direction: column;align-items: center">
        <el-tag class="ml-2" type="warning">
          您还没有绑定微信账号，请及时关注公众号，我们会在主机资源不足快内存溢出时及时通知疏散用户迁移实例
        </el-tag>
        <el-image style="width: 256px; height: 256px" :src="wxQrCodeUrl"/>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="wxQrCodeVisible = false">稍后关注</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {useStore} from 'vuex'

export default {
  name: "AircraftCarrier",
  data() {
    return {
      activeIndex: '/home/dashboard',
      userInfo: {},
      refreshSwitch: true,
      store: null,
      hasBindWx: false,
      hasBindEmail: false,
      wxBindCheckInterval: null,
      wxQrCodeVisible: false,
      wxQrCodeUrl: null,
      urgencyNotice: null
    }
  },
  mounted() {
    let current = window.location.href;
    let arr = current.split("#");
    // this.getUrgencyNotice();
    this.activeIndex = arr[arr.length - 1];
    this.store = useStore()
    this.userInfo = this.store.getters['userInfo'];
  },
  methods: {
    handleSelect(key, keyPath) {
      let refreshingInterval = this.store.getters['refreshingInterval'];
      if (refreshingInterval) {
        clearInterval(refreshingInterval);
        console.log("clearInterval" + refreshingInterval)
      }
    },
    getUrgencyNotice() {
      this.$httpUtil.get('/linker-server/api/v1/base/notice', {}).then(res => {
        if (res) {
          this.urgencyNotice = res.data.urgencyNotice;
          localStorage.setItem('residentNotice', res.data.residentNotice);
          let muteUrgencyNotice = localStorage.getItem('muteUrgencyNotice');
          let urgencyNotice = this.urgencyNotice;
          if (urgencyNotice && urgencyNotice !== muteUrgencyNotice) {
            this.$confirm(urgencyNotice, '温馨提示', {
              confirmButtonText: '我知道了',
              cancelButtonText: '不再提示',
              type: 'warning'
            }).then(() => {
              // 确认
            }).catch(() => {
              localStorage.setItem('muteUrgencyNotice', urgencyNotice);
            });
          }
        }
      }, (res) => {
        console.log(res);
      });
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    removeUserInfo() {
      localStorage.clear();
      sessionStorage.clear();
      this.store.commit("clearLoginInfo");
    },
    handleLogout() {
      this.removeUserInfo();
      setTimeout(() => {
        this.$router.push({
          path: '/home/boarding',
        })
      }, 1000);
    }
  }
}
</script>

<style scoped lang="less">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

#container {
  display: flex;
  flex-direction: column;
  background: #eceff4;

  #menu {
    width: 100%;

    #logo {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #409EFF;

      img {
        width: 128px;
      }
    }

    .el-menu {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }

  #main {
    padding: 8px;
  }
}
</style>
