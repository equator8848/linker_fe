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

        <el-dropdown>
          <span class="el-dropdown-link">
            <span style="color: #ebeef5">{{ currentProject.name }}</span>
            <el-icon class="el-icon--right">
              <arrow-down/>
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :v-show="projectList.length!==0" v-for="project in projectList" :key="project.id">
                <span :style="getProjectStyle(project)" @click="changeProject(project)">{{ project.name }}</span>
              </el-dropdown-item>
              <el-dropdown-item divided @click="gotoCreateProjectPage">新建项目</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-menu-item index="/home/dashboard">
          <el-icon>
            <Odometer/>
          </el-icon>
          <span>仪表盘</span>
        </el-menu-item>


        <el-popover trigger="hover" placement="bottom" :width="120" :hide-after="300">
          <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
            <el-button size="small" type="warning" @click="handleLogout">退出登录</el-button>
          </div>
          <template #reference>
            <el-button type="primary" @click="gotoUserCenter">{{ userInfo.nickName }}</el-button>
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
      activeIndex: '',
      userInfo: {},
      currentProject: {
        id: 0,
        name: "当前项目",
      },
      projectList: [],
      refreshSwitch: true,
      store: null,
      hasBindWx: false,
      hasBindEmail: false,
      wxBindCheckInterval: null,
      wxQrCodeVisible: false,
      wxQrCodeUrl: null,
      urgencyNotice: null,
    }
  },
  mounted() {
    let current = window.location.href;
    let arr = current.split("#");
    this.getProjectList();
    this.activeIndex = arr[arr.length - 1];
    this.store = useStore()
    this.userInfo = this.store.getters['userInfo'];

    const currentProjectJson = this.store.getters['currentProject'];
    if (currentProjectJson) {
      console.log("set current project in mounted method");
      this.currentProject = currentProjectJson;
      this.store.commit("setCurrentProject", this.currentProject);
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      let refreshingInterval = this.store.getters['refreshingInterval'];
      if (refreshingInterval) {
        clearInterval(refreshingInterval);
        console.log("clearInterval" + refreshingInterval)
      }
    },
    getProjectList() {
      this.$httpUtil.get('/linker-server/api/v1/project/all', {}).then(res => {
        if (res) {
          this.projectList = res.data;
          if (this.currentProject.id === 0) {
            const firstProject = this.projectList[0];
            this.currentProject = {
              id: firstProject.id,
              name: firstProject.name
            }
            this.store.commit("setCurrentProject", this.currentProject);
          }
        }
      }, (res) => {
        console.log(res);
      });
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
    gotoCreateProjectPage() {
      this.$router.push({
        path: `/home/projectOps`,
      })
    },
    gotoUserCenter() {
      this.$router.push({
        path: '/home/me'
      })
      this.activeIndex = ''
    },
    changeProject(project) {
      this.currentProject = project;
      this.store.commit("setCurrentProject", this.currentProject);
    },
    getProjectStyle(project) {
      if (this.currentProject.id === project.id) {
        return "color: #409EFF";
      }
      return "";
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
        width: 96px;
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
