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
        <div id="logo" style="width: 48px;height: 48px">
          <router-link to="/boarding"><img src="../assets/logo.png"></router-link>
        </div>

        <el-dropdown>
          <span class="el-dropdown-link">
            <span style="color: #ebeef5">{{ currentProjectName }}</span>
            <el-icon class="el-icon--right">
              <arrow-down/>
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :v-show="projectList.length!==0" v-for="project in projectList"
                                :key="project.id" @click="changeProject(project)">
                <span :style="getProjectStyle(project)">{{ project.name }}</span>
              </el-dropdown-item>
              <el-dropdown-item divided @click="gotoCreateProjectPage">新建项目</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-menu-item index="/home/link">
          <el-icon>
            <Odometer/>
          </el-icon>
          <span>主页</span>
        </el-menu-item>


        <el-popover trigger="hover" placement="bottom" :hide-after="300">
          <div class="userOpsBoard">
            <div>
              <el-button size="small" type="warning" @click="handleLogout">退出登录</el-button>
            </div>
            <div style="margin-top: 2px">
              <el-button size="small" type="info" @click="handleGotoAdmin" v-show="isAdmin()">管理后台</el-button>
            </div>
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
  </div>
</template>

<script>
import {useStore} from 'vuex'
import {isAdmin} from '@/common/roleTypeAuth'


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
      refreshSwitch: true,
      store: null,
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
      //  console.log("set current project in mounted method");
      this.currentProject = currentProjectJson;
      this.store.commit("setCurrentProject", this.currentProject);
    }

    let needUpdateUserNameFlag = this.store.getters['needUpdateUserName'];
    if (needUpdateUserNameFlag) {
      this.changeUsername();
    }
  },
  computed: {
    projectList() {
      const projectList = this.$store.getters['projectList'];
      return projectList ? projectList : [];
    },
    currentProjectName() {
      if (!this.projectList) {
        return;
      }
      const currentPjo = this.projectList.find(x => x.id === this.currentProject.id);
      return currentPjo ? currentPjo.name : "无";
    }
  },
  methods: {
    changeUsername() {
      this.$prompt('请修改用户名，让其他人可以识别你', '修改用户名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        this.$httpUtil.urlEncoderPut('/linker-server/api/v1/user/change-username', {
          newUsername: value
        }).then(res => {
          if (res) {
            this.$notify.success({
              title: '成功',
              message: '成功修改用户名',
              duration: 800
            });
            const newUserInfo = res.data;
            localStorage.setItem('user_info', JSON.stringify(newUserInfo));
            this.$store.commit("setUserInfo", newUserInfo);
            this.$store.commit("setNeedUpdateUserNameFlag", false);
            this.userInfo = newUserInfo;
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
    reload() {
      this.isRouteAlive = false;
      this.$nextTick(function () {
        this.isRouteAlive = true;
      })
    },
    isAdmin() {
      return isAdmin();
    },
    handleSelect(key, keyPath) {
      let refreshingInterval = this.store.getters['refreshingInterval'];
      if (refreshingInterval) {
        clearInterval(refreshingInterval);
        console.log("clearInterval" + refreshingInterval)
      }
    },
    getProjectList() {
      this.$httpUtil.get('/linker-server/api/v1/project/list', {}).then(res => {
        if (res) {
          this.store.commit("setProjectList", res.data);
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
    },
    handleGotoAdmin() {
      this.$router.push({
        path: '/admin/dashboard',
      })
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

.userOpsBoard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
    min-height: 100vh;
  }
}
</style>
