<template>
  <div id="container">
    <span @click="gotoMain"><a href="#">页面走丢了，点我回到主页</a></span>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  methods: {
    gotoMain() {
      this.$router.push({
        path: '/home/link',
      })
    }
  }
}
</script>

<style scoped lang="less">
#container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 64px;
  color: #ebeef5;
  background: #409EFF;

  a {
    color: white;
    text-decoration: none;
  }
}
</style>