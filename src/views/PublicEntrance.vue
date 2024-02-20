<template>
  <div id="container">
    <span style="text-align: center;color: dimgray">这里的公开入口所有人可见，无需登录本系统</span>
    <div v-for="publicEntrance in publicEntranceList" :key="publicEntrance.projectId" class="publicEntranceBoard">
      <el-divider content-position="center">{{ publicEntrance.projectName }}</el-divider>
      <el-table :data="publicEntrance.publicEntranceListInfos" stripe style="width: 100%">
        <el-table-column prop="name" label="名称"/>
        <el-table-column prop="intro" label="说明">
          <template #default="scope">
            <span style="white-space: pre-wrap;">
              {{ scope.row.intro }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="accessUrl" label="访问入口" align="right">
          <template #default="scope">
            <el-button size="small" type="primary" v-clipboard:copy="scope.row.accessUrl" v-clipboard:success="copySuccess"
                       v-clipboard:error="copyFail">复制入口地址</el-button>
            <el-button size="small" type="success" @click="jumpToNewTab(scope.row.accessUrl)">新窗口跳转</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "PublicEntrance",
  data() {
    return {
      publicEntranceList: []
    }
  },
  mounted() {
    this.getPublicEntranceList();
  },
  methods: {
    getPublicEntranceList() {
      this.$httpUtil.get('/linker-server/api/v1/anonymous/public-entrance', {}).then(res => {
        if (res) {
          this.publicEntranceList = res.data;
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        //
      });
    },
    jumpToNewTab(url) {
      window.open(url, '_blank');
    },
    copySuccess() {
      this.$message({
        type: 'success',
        message: `复制成功`
      });
    },
    copyFail() {
      this.$message({
        type: 'warning',
        message: '复制失败'
      });
    },
  },
}
</script>

<style scoped lang="less">
@import "@/assets/style/common.less";

#container {
  display: flex;
  min-height: 768px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .publicEntranceBoard {
    margin-top: 32px;
    height: 100%;
    width: 99%;
    .card-item();
  }
}
</style>
