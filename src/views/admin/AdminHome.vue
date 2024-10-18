<template>
  <div id="container">
    <div id="left">
      <div id="logo">
        <img src="../../assets/logo.png">
      </div>
      <el-popover trigger="hover" placement="bottom" :width="128">
        <div style="text-align: center;">
          <el-button size="small" type="warning" @click="handleLogout">退出登录</el-button>
        </div>
        <template #reference>
          <el-button type="primary" style="border-radius: 0">{{ userInfo.nickName }}</el-button>
        </template>
      </el-popover>

      <el-menu
          active-text-color="#ffd04b"
          background-color="#409EFF"
          class="el-menu-vertical-demo"
          default-active="2"
          text-color="#fff"
          router
          @open="handleOpen"
          @close="handleClose">

        <el-sub-menu index="dashboard">
          <template #title>
            <el-icon>
              <Odometer/>
            </el-icon>
            <span>仪表盘</span>
          </template>
          <el-menu-item index="/admin/dashboard">业务统计</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="project-instance">
          <template #title>
            <el-icon>
              <MostlyCloudy/>
            </el-icon>
            <span>业务管理</span>
          </template>
          <el-menu-item index="/admin/projectList">项目与实例</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="admin">
          <template #title>
            <el-icon>
              <Tools/>
            </el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/admin/userList">用户管理</el-menu-item>
          <el-menu-item index="/admin/loginLogList">登录记录</el-menu-item>
          <el-menu-item index="/admin/packageImage">打包镜像管理</el-menu-item>
          <el-menu-item index="/admin/appSetting">系统动态配置</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/home/link">
          <el-icon>
            <Back/>
          </el-icon>
          <span>回到首页</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div id="right">
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" :key="$route.fullPath"/>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script>
import {useStore} from 'vuex'
import {isSuperAdmin} from '@/common/roleTypeAuth'

export default {
  name: "AircraftCarrier",
  data() {
    return {
      userInfo: {},
      refreshSwitch: true,
      userOperationVisible: false
    }
  },
  mounted() {
    this.store = useStore()
    this.userInfo = this.store.getters['userInfo'];
    console.log(`userInfo ${JSON.stringify(this.userInfo)}`);
  },
  methods: {
    isSuperAdmin() {
      return isSuperAdmin();
    },
    handleSelect(key, keyPath) {
      //
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    removeUserInfo() {
      localStorage.clear();
      sessionStorage.clear();
      this.store.commit("clearLoginInfo");
    },
    handleLogout() {
      this.$confirm('确认是否退出登录？', '提醒', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeUserInfo();
        setTimeout(() => {
          this.$router.push({
            path: '/',
          })
        }, 1000);
      }).catch(() => {
        //
      });
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
  // background: linear-gradient(to right, #409EFF, goldenrod);
  background-color: #eceff4;
  // background-color: red;

  #left {
    width: 15%;
    display: flex;
    height: auto;
    flex-direction: column;

    #logo {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #409EFF;

      img {
        width: 128px;
      }
    }

    #greetings {
      color: white;
      background-color: #409EFF;
      text-align: center;
    }

    .el-menu {
      height: 100%;
      border: none;
    }
  }

  #right {
    width: 85%;
    height: 100vh;
    overflow: scroll;
  }
}
</style>
