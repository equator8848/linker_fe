<template>
  <div id="container">
    <div id="notice">
      <h2><a href="https://www.xiyoucloud.net/submitticket" target="_blank">提交工单请移步官网（点此跳转）</a></h2>
      <div>
        <h5>由于用户在本系统中拥有root权限，所以大部分问题需要用户自行解决。</h5>
        <h5>西柚云只提供存储、计算、网络等基础技术支持。</h5>
        <h5><a href="https://aomoow1hlm.feishu.cn/wiki/ZkIew9vTciqZXDk0NlwcxmeZnEc?from=from_copylink" target="_blank">R包的安装：如果是文档上面的R包，请自行安装，勿提工单浪费公共资源</a>
        </h5>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WorkOrder"
}
</script>

<style scoped lang="less">
@import "@/assets/style/common.less";

#container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100vh;
  .card-item();

  #notice {
    width: 500px;
    height: 500px;
    background: ghostwhite;
    border-radius: 16px;
    text-decoration: none;
    color: gray;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}
</style>
