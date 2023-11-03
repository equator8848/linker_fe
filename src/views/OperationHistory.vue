<template>
  <div id="container">
    <el-table :data="tableData" style="width: 100%;height: 100%">
      <el-table-column
          label="操作类型"
          prop="operationTypeStr">
      </el-table-column>
      <el-table-column
          label="资源名称"
          prop="resourceName">
      </el-table-column>
      <el-table-column
          label="操作人"
          prop="operationUsername">
      </el-table-column>
      <el-table-column
          label="创建时间"
          prop="createTime">
      </el-table-column>
      <el-table-column
          label="更新时间"
          prop="updateTime">
      </el-table-column>
      <el-table-column
          label="操作状态"
          prop="statusStr">
      </el-table-column>
      <el-table-column
          label="operationId"
          prop="lxdOperationId">
      </el-table-column>
      <el-table-column
          label="日志信息"
          prop="operationMessage">
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
import {commonSettings, operationStatusStr} from '@/common/constant'
import Throttle from '@/common/throttle'

export default {
  name: "UserList",
  inject: ['reload'],
  data() {
    return {
      dialogFormVisible: false,
      search: '',
      tableData: [],
      total: 0,
      current: 1,
      pageSize: 0,
      store: null,
      refreshingInterval: null,
      throttler: null
    }
  },
  mounted() {
    this.getOperations(this.current);
    this.throttler = new Throttle(12, () => {
      this.getOperations(this.current);
      console.log("获取操作日志列表-节流器执行");
    }, () => {
      console.log("获取操作日志列表-节流器节流");
    });
    this.refreshingInterval = setInterval(() => {
      this.throttler.tryExec(this.hasTemporaryStatus);
    }, commonSettings.refreshingIntervalMs);
  },
  unmounted() {
    if (this.refreshingInterval) {
      clearInterval(this.refreshingInterval);
    }
  },
  methods: {
    getOperations(pageNum) {
      this.$httpUtil.get('/linker-server/api/v1/operation/list', {
        search: this.search,
        pageNum: pageNum
      }).then(res => {
        if (res) {
          let response = res.data;
          this.tableData = response.data;
          this.total = response.total;
          this.current = response.pageNum;
          this.pageSize = response.size;
        }
      }, res => {
        console.log(res);
      });
    },
    hasTemporaryStatus() {
      for (let idx = 0; idx < this.tableData.length; idx++) {
        let item = this.tableData[idx];
        if (item.statusStr === operationStatusStr.RUNNING || item.statusStr === operationStatusStr.INIT) {
          return true;
        }
      }
      return false;
    },
    refresh() {
      this.reload();
    },
    handleCurrentChange(pageNum) {
      this.getOperations(pageNum);
    }
  }
}
</script>

<style scoped lang="less">
@import "@/assets/style/common.less";

#container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin-top: 8px;
}

#operation-board {
  display: flex;
  justify-content: space-between;
  .card-item();
}
</style>
