<template>
  <div id="container">
    <el-table :data="projectList" style="width: 100%;height: 100%">
      <el-table-column
          label="项目ID"
          prop="id">
      </el-table-column>
      <el-table-column
          width="256px"
          label="项目名称"
          prop="name">
      </el-table-column>
      <el-table-column
          width="256px"
          label="项目描述"
          prop="intro">
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

      <el-table-column align="right">
        <template #header>
          <div id="operation-board">
            <el-divider direction="vertical"></el-divider>
            <el-input
                v-model="search"
                size="small"
                @keyup.enter="handleSearch"
                placeholder="输入项目名称、描述进行搜索"/>
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
          <el-button type="primary"  size="small" @click="handleGoDetails(scope.$index, scope.row)">详情</el-button>
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
</template>

<script>
import {isSuperAdmin} from '@/common/roleTypeAuth'

export default {
  name: "ProjectList",
  inject: ['reload'],
  data() {
    return {
      search: '',
      projectList: [],
      total: 0,
      current: 1,
      pageSize: 0,
    }
  },
  mounted() {
    this.getProjectList(this.current);
  },
  methods: {
    isSuperAdmin() {
      return isSuperAdmin();
    },
    getProjectList(pageNum) {
      this.$httpUtil.jsonPost('/linker-server/api/v1/project/all', {
        searchKeyword: this.search,
        pageNum: pageNum
      }).then(res => {
        if (res) {
          let response = res.data;
          this.projectList = response.data;
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
    handleSearch() {
      this.getProjectList(1);
    },
    handleGoDetails(idx, item) {
      this.$router.push({
        path: `/admin/projectDetails/${item.id}`,
      })
    },
    refresh() {
      this.getProjectList(this.current);
    },
    handleCurrentChange(pageNum) {
      this.getProjectList(pageNum);
    },
  }
}
</script>

<style scoped lang="less">
@import "@/assets/style/common.less";

#container {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

#operation-board {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
