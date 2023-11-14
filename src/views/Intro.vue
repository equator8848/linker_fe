<template>
  <div id="container">
    <el-carousel :interval="5000" arrow="always" height="256px">
      <el-carousel-item v-for="item in introTexts" :key="item">
        <div class="carousel-item">
          <h1>{{ item }}</h1>
        </div>
      </el-carousel-item>
    </el-carousel>
    <div id="exhibition">
      <div id="exhibition-show">
        <h1>欢迎使用 Linker——前后端联调平台</h1>
        <h2>本系统基于Jenkins、Docker实现前端项目容器化部署，按照配置将请求转化到对应的地址</h2>
        <h3>应用场景1：前端研发人员部署前端某个分支的代码，模拟线上环境构建</h3>
        <h3>应用场景2：尝鲜体验前端未发布的某个分支的代码（如：其他人想要使用CodeReview中的前端代码）</h3>
        <h3>应用场景3：后端研发部署前端某个分支的代码，请求自己本地的服务，实现自测或者后端重构代码后回归测试</h3>
      </div>
    </div>
    <div id="usage-step">
      <h2>简单几步即可使用我们的服务</h2>
      <el-steps :active="3" finish-status="success" align-center>
        <el-step title="进入项目" description="创建或加入项目"></el-step>
        <el-step title="配置实例" description="配置前端API代理地址"></el-step>
        <el-step title="使用" description="开始联调之旅"></el-step>
      </el-steps>
    </div>
  </div>
</template>

<script>
export default {
  name: "Intro",
  data() {
    return {
      introTexts: [
        "痛点一：研发本地环境与线上环境有差异，同样的代码，本地线上表现不一致",
        "痛点二：前端开发了一部分的代码，其它人需要使用这些未合并到主干分支或者未发布到测试服的代码",
        "痛点三：后端做了大量重构，而项目本身没有写单元测试，不知道重构是否影响正常功能，使用postman调接口太麻烦",
      ],
    };
  },
}
</script>

<style scoped lang="less">
.carousel-item {
  background: linear-gradient(to bottom, #409EFF, skyblue);
  color: white;
  width: 100%;
  height: 256px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#exhibition {
  background-image: url("../assets/hosting.png");
  padding: 280px 0 260px;
  height: 784px;
  z-index: 0;
  background-color: #0069ff;
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;

  #exhibition-show {
    color: white;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

#usage-step {
  height: 512px;
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: space-around;
  align-content: center;
  padding: 8px;
  background-color: white;
}
</style>
