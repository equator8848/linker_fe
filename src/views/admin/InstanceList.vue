<template>
  <div id="container">
    <el-table :data="instances" style="width: 100%;height: 100%">
      <el-table-column
          width="128px"
          label="实例ID"
          prop="id">
      </el-table-column>
      <el-table-column
          width="128px"
          label="官网用户ID"
          prop="userRelationId">
      </el-table-column>
      <el-table-column
          width="256px"
          label="实例名称"
          prop="name">
      </el-table-column>
      <el-table-column
          width="128px"
          label="实例状态"
          prop="instanceStatusStr">
      </el-table-column>
      <el-table-column
          width="180px"
          label="更新时间"
          prop="updateTime">
      </el-table-column>

      <el-table-column align="right">
        <template #header>
          <div id="operation-board">
            <el-select v-model="searchType" placeholder="请选择实例筛选项" size="small" @change="handleSearch">
              <el-option
                  v-for="item in searchTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
            <el-divider direction="vertical"></el-divider>
            <el-input
                v-model="search"
                size="small"
                @keyup.enter="handleSearch"
                placeholder="输入实例名称、UID、官网用户ID搜索"/>
            <el-button
                size="small"
                type="primary"
                @click="handleSearch">搜索
            </el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button
                size="small"
                type="info"
                @click="refresh">刷新
            </el-button>
            <el-button
                size="small"
                type="danger"
                v-show="searchType==='NEED_CLEAR'&&isSuperAdmin()"
                @click="batchHardDelete">批量硬删除
            </el-button>
            <el-button
                size="small"
                type="danger"
                v-show="searchType==='EXPIRED'&&isSuperAdmin()"
                @click="batchSoftDelete">批量软删除
            </el-button>
          </div>
        </template>
        <template #default="scope">
          <el-button size="small" type="danger" v-show="showHardDeleteButton(scope.row)&&isSuperAdmin()"
                     @click="handleHardDeleteInstance(scope.row)">硬删除
          </el-button>
          <el-button size="small" type="danger" v-show="showSoftDeleteButton()&&isSuperAdmin()"
                     @click="handleSoftDeleteInstance(scope.row)">软删除
          </el-button>
          <el-button type="info" size="small"
                     @click="handleClickShowOperationHistoryButton(scope.row)">查看操作历史
          </el-button>
          <el-button size="small" @click="handleGoDetails(scope.$index, scope.row)">详情</el-button>
          <el-button size="small" @click="handleGoDetailsNewTab(scope.$index, scope.row)">新窗口打开详情</el-button>
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

    <el-dialog v-model="operationHistoryVisible" title="实例操作历史">
      <el-table :data="operationHistoryList" style="width: 100%;" stripe>
        <el-table-column property="operationTypeStr" label="操作类型"/>
        <el-table-column property="operationUsername" label="操作人"/>
        <el-table-column property="createTime" label="创建时间"/>
        <el-table-column property="updateTime" label="更新时间"/>
        <el-table-column property="statusStr" label="状态"/>
        <el-table-column property="operationMessage" label="操作信息"/>
        <el-table-column property="remark" label="备注"/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {instanceSearchType, clearStatus} from '@/common/constant'
import {useStore} from "vuex";
import {isSuperAdmin} from '@/common/roleTypeAuth'

export default {
  name: "InstanceList",
  inject: ['reload'],
  data() {
    return {
      searchTypeOptions: [{
        value: 'NO_NEED_CLEAR',
        label: '正常实例'
      }, {
        value: 'NEED_CLEAR',
        label: '已软删除实例'
      }, {
        value: 'CLEARED',
        label: '已物理删除实例'
      }, {
        value: 'EXPIRED',
        label: '已过期实例'
      }],
      search: '',
      searchType: 'NO_NEED_CLEAR',
      clusters: [],
      instances: [],
      total: 0,
      current: 1,
      pageSize: 0,
      store: null,
      operationHistoryVisible: false,
      operationHistoryList: [],
    }
  },
  mounted() {
    this.getInstanceList(this.current);
  },
  methods: {
    isSuperAdmin() {
      return isSuperAdmin();
    },
    getInstanceList(pageNum) {
      const loading = this.$loading({
        lock: true,
        text: '数据加载中，如果长时间加载不出来，可能是搜索的实例卡住了，需要告知用户，我们进行强制重启',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$httpUtil.get('/api/v1/instance/list', {
        search: this.search,
        searchType: this.searchType,
        pageNum: pageNum
      }).then(res => {
        if (res) {
          let response = res.data;
          this.instances = response.data;
          this.total = response.total;
          this.current = response.pageNum;
          this.pageSize = response.size;
        }
      }, (res) => {
        console.log(res);
      }).finally(() => {
        loading.close();
      });
    },
    handleSearch() {
      this.getInstanceList(1);
    },
    handleClickShowOperationHistoryButton(instance) {
      this.$httpUtil.get('/api/v1/operation/get-by-instance-id', {
        instanceId: instance.id
      }).then(res => {
        if (res) {
          this.operationHistoryList = res.data.data;
        }
      }, res => {
        console.log(res);
      });
      this.operationHistoryVisible = true;
    },
    handleGoDetails(idx, item) {
      this.$router.push({
        path: `/home/instanceDetails/${item.id}`,
      })
    },
    handleGoDetailsNewTab(idx, item) {
      let routeUrl = this.$router.resolve({
        path: `/home/instanceDetails/${item.id}`,
      });
      window.open(routeUrl.href, '_blank');
    },
    refresh() {
      this.getInstanceList(this.current);
    },
    batchHardDelete() {
      this.instances.forEach(
          instance => {
            if (instance.canHardDelete) {
              this.doHardDeleteInstance(instance);
            }
          }
      );
    },
    batchSoftDelete() {
      this.instances.forEach(
          instance => {
            if (instance.canSoftDelete) {
              this.doSoftDeleteInstance(instance);
            }
          }
      );
    },
    handleCurrentChange(pageNum) {
      this.getInstanceList(pageNum);
    },
    showHardDeleteButton(instance) {
      return clearStatus.NEED_CLEAR === instance.clearStatus;
    },
    showSoftDeleteButton() {
      return this.searchType === 'EXPIRED'
    },
    doHardDeleteInstance(instance) {
      const loading = this.$loading({
        lock: true,
        text: '操作中，请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$httpUtil.urlEncoderDelete('/api/v1/instance/delete-hard', {
        instanceId: instance.id
      }).then(res => {
        if (res) {
          this.$notify.success({
            title: '成功',
            message: '实例删除成功'
          });
        }
      }, res => {
        console.log("删除实例失败");
        loading.close();
      }).finally(() => {
        loading.close();
        setTimeout(() => {
          this.refresh();
        }, 1500);
      });
    },
    handleSoftDeleteInstance(instance) {
      this.$confirm('准备逻辑删除实例，是否继续？', '确认', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        this.doSoftDeleteInstance(instance);
      }).catch(() => {
        //
      });
    },
    handleHardDeleteInstance(instance) {
      this.$confirm('删除实例会删除所有相关数据，操作不可逆，是否继续？', '高危操作', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        this.doHardDeleteInstance(instance);
      }).catch(() => {
        //
      });
    },
    doSoftDeleteInstance(instance) {
      this.$httpUtil.jsonPut('/api/v1/instance/delete', {
        instanceId: instance.id,
        deleteVolume: true
      }).then(res => {
        if (res) {
          this.$notify.success({
            title: '成功',
            message: '实例删除成功'
          });
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        setTimeout(() => {
          this.refresh();
        }, 1500);
      });
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

  .instance-info {
    .card-item();
    display: flex;
    flex-direction: column;

    .network-port-mapping {
      margin-top: 4px;
    }
  }
}

#operation-board {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
