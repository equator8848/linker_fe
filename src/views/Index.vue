<template>
  <div id="container">
    <div id="header">
      <img src="../assets/logo.png" id="logo">
      <el-menu router :default-active="activeIndex" class="el-header-menu" mode="horizontal"
               background-color="#409EFF" active-text-color="yellow" text-color="#fff"
               @select="handleSelect">
        <el-menu-item index="/intro">首页</el-menu-item>
        <el-menu-item index="/help">帮助文档</el-menu-item>
        <el-menu-item index="/publicEntrance">公开入口</el-menu-item>
        <el-menu-item index="/boarding">用户中心</el-menu-item>
      </el-menu>
    </div>
    <div id="main">
      <router-view v-slot="{ Component }">
        <transition name="scale" mode="out-in">
          <component :is="Component" :key="$route.fullPath"/>
        </transition>
      </router-view>
    </div>
    <div id="footer">
      <div id="foot-left">
        <h4>联系作者</h4>
        <h5>电子邮箱： 841116931@qq.com</h5>
        <img src="../assets/wx.jpg" width="128px" height="128px">
      </div>
      <div id="foot-right">
        <h4>相关链接</h4>
        <h5><a target="_blank" href="https://github.com/libinkai/linker_fe">GitHub前端项目地址</a></h5>
        <h5><a target="_blank" href="https://github.com/libinkai/linker_be">GitHub后端项目地址</a></h5>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      activeIndex: '/intro',
    };
  },
  mounted() {
    let current = window.location.href;
    let arr = current.split("#");
    this.activeIndex = arr[arr.length - 1];
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeIndex = key;
    }
  }
}
</script>

<style scoped lang="less">
.scale-enter-active,
.scale-leave-active {
  transition: all 0.5s ease;
}


.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

#container {
  background-color: #eceff4;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;

  #header {
    display: flex;
    justify-content: space-around;
    background-color: #409EFF;
    height: 64px;

    #logo {
      display: block;
      max-height: 64px;
    }


    .el-header-menu {
      display: flex;
      width: 50%;
      justify-content: space-around;
      border: none;

    }
  }

  #main {
    // margin-bottom: 256px;
    overflow: hidden;
  }

  #footer {
    width: 100%;
    height: 300px;
    background: linear-gradient(to bottom right, deepskyblue, blue);
    display: flex;
    justify-content: space-around;
    align-content: center;


    #foot-left {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-content: center;
      margin: 4px;
      color: #eceff4;
    }

    #foot-right {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-content: center;
      margin: 4px;
      color: whitesmoke;

      a {
        color: whitesmoke;
        text-decoration: none;
      }
    }
  }
}
</style>
