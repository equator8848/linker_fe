<template>
  <div id="container">
    <div id="domainCheck">
      <h2>线路域名检测</h2>
      <h4 style="color:grey;">自动检验线路连通性，如遇到某个线路不可用，请切换到其它线路使用</h4>
      <DomainCheck/>
    </div>
  </div>
</template>

<script>
import DomainCheck from "@/components/DomainCheck";

export default {
  name: "StatusCheck",
  components: {DomainCheck}
}
</script>

<style scoped lang="less">
@import "@/assets/style/common.less";

#container {
  display: flex;
  flex-direction: column;
  height: 100vh;

  #domainCheck {
    width: 100%;
    .card-item();
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
