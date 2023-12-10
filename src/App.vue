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
  mounted() {
    this.getPluginMeta();
  },
  methods: {
    reload() {
      this.isRouteAlive = false;
      this.$nextTick(function () {
        this.isRouteAlive = true;
      })
    },
    getPluginMeta() {
      this.$httpUtil.get('/linker-server/api/v1/plugin/plugin-meta', {}).then(res => {
        if (res) {
          let codeSet = new Set();
          res.data.map(pluginMeta => pluginMeta.code).forEach(code => {
            codeSet.add(code);
          })
          this.$store.commit("setPluginCodeSet", codeSet);
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        //
      });
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
