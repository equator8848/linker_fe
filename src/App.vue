<template>
  <div id="app">
    <router-view v-if="isRouteAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouteAlive: true
    }
  },
  methods: {
    reload() {
      this.isRouteAlive = false;
      this.$nextTick(function () {
        this.isRouteAlive = true;
      })
    }
  }
}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}

::-webkit-scrollbar {
  display: none;
}

* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
</style>
