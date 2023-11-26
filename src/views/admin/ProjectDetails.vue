<template>
  <div id="container">
    <div id="header">
      <el-page-header @back="goBack" content="项目详情" title="返回"></el-page-header>
    </div>
    <div id="project-info">
      <el-descriptions :title="projectInfo.name" border :column="1">
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <location/>
              </el-icon>
              项目ID
            </div>
          </template>
          {{ projectInfo.id }}
          <el-icon v-clipboard:copy="projectId" v-clipboard:success="copySuccess"
                   v-clipboard:error="copyFail">
            <CopyDocument/>
          </el-icon>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Tickets/>
              </el-icon>
              项目说明
            </div>
          </template>
          {{ projectInfo.intro }}
        </el-descriptions-item>


        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Clock/>
              </el-icon>
              创建时间-创建人
            </div>
          </template>
          {{ projectInfo.createTime }} @ {{ projectInfo.createUserName }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Clock/>
              </el-icon>
              更新时间-更新人
            </div>
          </template>
          {{ projectInfo.updateTime }} @ {{ projectInfo.updateUserName }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Camera/>
              </el-icon>
              项目打包镜像
            </div>
          </template>
          {{ projectInfo.packageImage }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Camera/>
              </el-icon>
              项目打包分支
            </div>
          </template>
          {{ projectInfo.scmConfig ? projectInfo.scmConfig.defaultBranch : '' }}
        </el-descriptions-item>


        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Star/>
              </el-icon>
              项目打包脚本
            </div>
          </template>
          <span style="white-space: pre-wrap;">
              {{ projectInfo.packageScript }}
            </span>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <el-divider content-position="center">
      <span>实例列表</span>
    </el-divider>

    <div id="instance-info">
      <el-table :data="instanceList" style="width: 100%;height: 100%">
        <el-table-column
            width="256px"
            label="实例ID"
            prop="id">
        </el-table-column>
        <el-table-column
            width="180px"
            label="创建时间"
            prop="createTime">
        </el-table-column>
        <el-table-column
            width="180px"
            label="更新时间"
            prop="updateTime">
        </el-table-column>

        <el-table-column
            width="256px"
            label="实例名称"
            prop="name">
        </el-table-column>

        <el-table-column align="right">
          <template #header>
            <div id="operation-board">
              <el-input
                  v-model="search"
                  size="small"
                  @keyup.enter="handleSearch"
                  style="max-width: 256px"
                  placeholder="输入实例名称、描述进行搜索"/>
              <el-button
                  size="small"
                  type="primary"
                  @keydown.enter="handleSearch"
                  @click="handleSearch">搜索
              </el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                  size="small"
                  type="info"
                  @click="refresh">刷新
              </el-button>
            </div>
          </template>
          <template #default="scope">
            {{ scope.row.intro }}
            <el-button size="small" @click="handleShowInstanceDetails(scope.$index, scope.row)" disabled>查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          style="background-color: white"
          background
          layout="prev, pager, next"
          :current-page="current"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>

export default {
  name: "ProjectDetails",
  inject: ['reload'],
  mounted() {
    this.projectId = this.$route.params.projectId;
    this.getProjectInfo(this.projectId);
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    refresh() {
      this.reload();
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
    getProjectInfo(projectId) {
      this.$httpUtil.get('/linker-server/api/v1/project/details', {
        projectId
      }).then(res => {
        if (res) {
          this.projectInfo = res.data;
          this.getInstanceList(this.projectId, 1);
        }
      }, (res) => {
        console.log(res);
      })
    },
    getInstanceList(projectId, pageNum) {
      this.$httpUtil.jsonPost('/linker-server/api/v1/instance/all', {
        projectId: projectId,
        searchKeyword: this.search,
        pageNum: pageNum
      }).then(res => {
        if (res) {
          let response = res.data;
          this.instanceList = response.data;
          this.total = response.total;
          this.current = response.pageNum;
          this.pageSize = response.size;
        }
      }, (res) => {
        console.log(res);
      }).finally(() => {
        //
      });
    },
    handleShowInstanceDetails(idx, instance) {
      //
    },
    handleSearch() {
      this.getInstanceList(this.projectId, 1);
    },
    handleCurrentChange(pageNum) {
      this.getProjectList(pageNum);
    },
  },
  data() {
    return {
      projectId: 0,
      projectInfo: {
        id: 0,
        name: '',
        intro: null,
        createUserName: null,
        createTime: null,
        updateUserName: null,
        updateTime: null,
      },

      instanceList: [],
      search: null,
      total: 0,
      current: 1,
      pageSize: 0,
    }
  }
}
</script>

<style scoped lang="less">
@import "@/assets/style/common.less";

#container {
  display: flex;
  flex-direction: column;

  #header {
    background-color: whitesmoke;
    height: 50px;
    display: flex;
    align-items: center;
  }

  #project-info {
    .card-item();
  }

  #instance-info {
    .card-item();
  }
}
</style>