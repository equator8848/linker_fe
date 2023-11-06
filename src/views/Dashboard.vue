<template>
  <div id="container">
    <div id="resident-notice-info" v-show="residentNotice">
      <h3>公告栏</h3>
      <div v-html="residentNotice"></div>
    </div>

    <div id="message-inbox">
      <h3>消息通知</h3>
      <h6 style="color:grey;">这里展示系统或管理员发送给用户的消息</h6>
      <el-table
          :data="messageInboxList" max-height="256px" style="width: 100%;" size="mini"
          @row-click="handleMsgRowClick"
          highlight-current-row>
        <el-table-column label="消息标题">
          <template #default="scope">
            <div style="padding: 4px">
              <el-badge is-dot class="item" :hidden="!scope.row.unRead">{{ scope.row.msgTitle }}</el-badge>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" sortable></el-table-column>

        <el-table-column align="right">
          <template #header>
            <div id="operation-board">
              <el-select v-model="messagePageSize" placeholder="消息条数" size="small"
                         @change="handleMessageSearchChange">
                <el-option
                    v-for="item in messagePageSizeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>

              <el-switch
                  v-model="onlyUnReadMessage"
                  active-text="只看未读"
                  @change="handleMessageSearchChange"
                  style="margin-left: 8px">
              </el-switch>
            </div>
          </template>
          <template #default="scope">
            <el-button size="small" @click="handleMessageDetails(scope.$index, scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div id="cluster-info">
      <h3>集群资源信息</h3>
      <h6 style="color:grey;">鼠标悬浮至主机名可查看详细配置，双击查看资源使用曲线</h6>
      <el-table :data="clusterResourceTableData" style="width: 100%;margin-top: 4px"
                @row-dblclick="clusterResourceRowDoubleClick"
                :row-class-name="clusterLoadTableRowClassName">
        <el-table-column label="主机信息" sortable>
          <template #default="scope">
            <el-popover effect="light" trigger="hover" placement="right-end" width="auto">
              <template #default>
                <div>主机编号: {{ scope.row.maskNodeId }}</div>
                <div>CPU核心数: {{ scope.row.cpuCoreNum }}</div>
                <div>内存（GB）: {{ scope.row.memoryGb }}</div>
                <div>维护中: {{ scope.row.maintenanceMode ? "是" : "否" }}</div>
                <div>可使用此节点的套餐: {{ scope.row.planingLimitStrList }}</div>
              </template>
              <template #reference>
                <el-tag>{{ scope.row.displayName }}</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="cpuUsage" label="CPU使用率（%）" sortable/>
        <el-table-column prop="memoryUsage" label="内存使用率（%）" sortable/>
        <el-table-column prop="nodeLoadAvg1" label="系统1分钟平均负载" sortable/>
        <el-table-column prop="nodeLoadAvg5" label="系统5分钟平均负载" sortable/>
        <el-table-column prop="nodeLoadAvg15" label="系统15分钟平均负载" sortable/>
        <el-table-column>
          <template #header>
            <el-tooltip
                class="box-item"
                effect="dark"
                content="自动识别，判断节点是否可用"
                placement="top-start">
              <span>节点在线情况
              <el-icon><QuestionFilled/></el-icon>
              </span>
            </el-tooltip>
          </template>
          <template #default="scope">
            <el-tag class="ml-2" :type="getNodeStatusTagColor(scope.row)">{{
                scope.row.isActive ? "在线" : "离线"
              }}
            </el-tag>
            <el-tag class="ml-2 instance-node-status-tag" :type="getNodeLoadStatusColor(scope.row)">{{
                getNodeLoadStatusStr(scope.row)
              }}
            </el-tag>
            <el-tag class="ml-2" style="margin-left: 2px"
                    :type="getNodeIsCrowdedStatusTagColor(scope.row)" v-show="scope.row.isCrowded">拥挤
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column>
          <template #header>
            <el-tooltip
                class="box-item"
                effect="dark"
                content="管理员手动标识，维护模式中的节点不可用或者不推荐使用"
                placement="top-start">
              <span>节点维护情况
              <el-icon><QuestionFilled/></el-icon>
              </span>
            </el-tooltip>
          </template>
          <template #default="scope">
            <el-tag class="ml-2" :type="getMaintenanceModeTagColor(scope.row)">
              {{ scope.row.maintenanceMode ? "维护中" : "正常使用" }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div v-loading="clusterResourceDashboardLoading">
        <el-select v-model="clusterResourceNodeId" placeholder="目标主机" style="padding: 4px"
                   @change="initClusterResourceDashboardData(this.clusterResourceNodeId,this.clusterResourceQueryType,this.clusterResourceQueryRangeDay)">
          <el-option
              v-for="item in clusterResourceTableData"
              :key="item.nodeId"
              :label="item.displayName"
              :value="item.nodeId">
          </el-option>
        </el-select>
        <el-select v-model="clusterResourceQueryRangeDay" placeholder="查询范围" style="padding: 4px"
                   @change="initClusterResourceDashboardData(this.clusterResourceNodeId,this.clusterResourceQueryType,this.clusterResourceQueryRangeDay)">
          <el-option
              v-for="item in clusterResourceQueryRangeDayOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="clusterResourceQueryType" placeholder="请选择查询类型" style="padding: 4px"
                   @change="initClusterResourceDashboardData(this.clusterResourceNodeId,this.clusterResourceQueryType,this.clusterResourceQueryRangeDay)">
          <el-option
              v-for="item in clusterResourceQueryTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <div id="clusterResourceDashboard"></div>
      </div>
    </div>

    <div id="specification-info">
      <h3>实例资源套餐信息</h3>
      <el-table :data="specificationList" style="width: 100%;margin-top: 8px">
        <el-table-column label="套餐ID" prop="id"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="vCPU" prop="cpu"></el-table-column>
        <el-table-column label="内存（GB）" prop="memory"></el-table-column>
        <el-table-column label="总硬盘（GB）" prop="disk"></el-table-column>
        <el-table-column label="系统盘（GB）" prop="osDisk"></el-table-column>
        <el-table-column label="过期时间" prop="expiredAt"></el-table-column>
        <el-table-column label="绑定实例ID" prop="instanceId"></el-table-column>
        <el-table-column label="绑定数据卷ID" prop="volumeId"></el-table-column>
      </el-table>
    </div>

    <div id="instance-info">
      <div id="instance-number-block">
        <h5>实例数
          <el-icon @click="gotoInstanceList">
            <Position/>
          </el-icon>
        </h5>
        <h1 id="instance-number">{{ instanceResourceTableData.length }}</h1>
      </div>
      <div id="instance-resource-block">
        <el-table
            :data="instanceResourceTableData" max-height="256px" size="mini">
          <el-table-column prop="name" width="256px" label="名称"></el-table-column>
          <el-table-column prop="locationNodeDisplayName" width="128px" label="所属节点"></el-table-column>
          <el-table-column prop="instanceStatusStr" width="128px" label="运行状态"></el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog title="查看消息详情" v-model="messageDetailsDialogVisible">
      <el-form :model="messageInboxDetails" label-position="top">
        <el-form-item label="消息标题" label-width="150px">
          <el-input type="text" v-model="messageInboxDetails.msgTitle" disabled></el-input>
        </el-form-item>
        <el-form-item label="创建时间" label-width="150px">
          <el-input type="text" v-model="messageInboxDetails.createTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="消息内容" label-width="150px">
          <el-input type="textarea" v-model="messageInboxDetails.msgContent" disabled></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="messageDetailsDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {getPlaningStrList, nodeIdMask} from '@/common/format'
import * as echarts from "echarts/core";

export default {
  name: "DashBoard",
  mounted() {
    //
  },
  unmounted() {
    if (this.clusterResourceDashboardChart) {
      // console.log("clusterResourceDashboardChart dispose");
      this.clusterResourceDashboardChart.dispose();
    }
  },
  methods: {
    clusterLoadTableRowClassName({row, rowIndex}) {
      if (row.maintenanceMode) {
        return 'maintenance-row';
      } else if (row.cpuUsage > 80 || row.memoryUsage > 80) {
        return 'danger-row';
      } else if (row.cpuUsage > 60 || row.memoryUsage > 60) {
        return 'warning-row';
      } else {
        return 'healthy-row';
      }
    },
    getNodeStatusTagColor(node) {
      if (node.isActive) {
        return '';
      }
      return 'danger';
    },
    getNodeLoadStatusStr(item) {
      if (item.cpuUsage > 80 || item.memoryUsage > 80) {
        return '负载高';
      } else if (item.cpuUsage > 60 || item.memoryUsage > 60) {
        return '负载中等';
      } else {
        return '负载低';
      }
    },
    getNodeLoadStatusColor(item) {
      if (item.cpuUsage > 80 || item.memoryUsage > 80) {
        return 'danger';
      } else if (item.cpuUsage > 60 || item.memoryUsage > 60) {
        return 'warning';
      } else {
        return 'success';
      }
    },
    getNodeIsCrowdedStatusTagColor(node) {
      if (node.isCrowded) {
        return 'danger';
      }
      return '';
    },
    getMaintenanceModeTagColor(node) {
      if (node.maintenanceMode) {
        return 'danger';
      }
      return '';
    },
    clusterResourceRowDoubleClick(row, column, event) {
      this.clusterResourceNodeId = row.nodeId;
      this.initClusterResourceDashboardData(this.clusterResourceNodeId, this.clusterResourceQueryType, this.clusterResourceQueryRangeDay);
    },
    getClusterResourceInfo() {
      this.$httpUtil.get('/linker-server/api/v1/cluster/resource-data', {}).then(res => {
        if (res) {
          this.clusterResourceTableData = res.data.nodeResources;
          this.clusterResourceTableData.forEach(node => {
            // node.maintenanceModeDisplay = node.maintenanceMode ? "维护中" : "正常使用";
            // node.statusDisplay = node.isActive ? "在线" : "离线";
            node.cpuUsage = node.cpuUsage ? parseFloat(node.cpuUsage.toFixed(2)) : 0;
            node.memoryUsage = node.memoryUsage ? parseFloat(node.memoryUsage.toFixed(2)) : 0;
            node.maskNodeId = nodeIdMask(node.nodeId);
            node.planingLimitStrList = getPlaningStrList(node.allowPlannings);
          })
          this.initClusterResourceDashboard();
        }
      }, res => {
        console.log(res);
      });
    },
    getInstanceList() {
      const loading = this.$loading({
        lock: true,
        text: '正在查询实例列表，如果长时间加载不出来，一般是实例占用大量内存的时候您重启了实例，导致卡住，这个时候需要联系管理员强制重启，会丢失内存中的数据',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$httpUtil.get('/linker-server/api/v1/instance/my-instances', {}).then(res => {
        if (res) {
          this.instanceResourceTableData = res.data;
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        loading.close();
      });
    },
    getSpecificationList() {
      this.$httpUtil.get('/linker-server/api/v1/specification/list', {}).then(res => {
        if (res) {
          this.specificationList = res.data;
        }
      }, res => {
        console.log(res);
      })
    },
    getMessageList() {
      this.$httpUtil.get('/linker-server/api/v1/message/message-inbox-list', {
        pageSize: this.messagePageSize,
        onlyUnRead: this.onlyUnReadMessage
      }).then(res => {
        if (res) {
          this.messageInboxList = res.data.data;
        }
      }, res => {
        console.log(res);
      })
    },
    handleMessageSearchChange() {
      this.getMessageList();
    },
    displayMsgDetails(item) {
      this.$httpUtil.get('/linker-server/api/v1/message/message-inbox-details', {
        messageId: item.id
      }).then(res => {
        if (res) {
          this.messageInboxDetails = res.data;
          this.messageDetailsDialogVisible = true;

          this.messageInboxList.forEach(msg => {
            if (msg.id === item.id) {
              msg.unRead = false
            }
          })
        }
      }, res => {
        console.log(res);
      })
    },
    handleMessageDetails(idx, item) {
      this.displayMsgDetails(item);
    },
    handleMsgRowClick(row, column, event) {
      this.displayMsgDetails(row);
    },
    initClusterResourceDashboard() {
      // console.log("initClusterResourceDashboard");
      this.$nextTick(() => {
        const chartDom = document.getElementById('clusterResourceDashboard');
        if (!chartDom) {
          return;
        }
        this.clusterResourceDashboardChart = echarts.init(chartDom);
        this.clusterResourceNodeId = this.clusterResourceTableData[0].nodeId;
        this.initClusterResourceDashboardData(this.clusterResourceNodeId, 'CPU', 1);
      });
    },
    getClusterResourceQueryStr(queryType) {
      switch (queryType) {
        case 'CPU':
          return 'CPU';
        case 'CPU_DETAILS':
          return 'CPU详情';
        case 'MEMORY':
          return '内存';
        default:
          return '未知';
      }
    },
    initClusterResourceDashboardData(nodeId, queryType, queryRangeDay) {
      this.clusterResourceDashboardLoading = true;
      this.$httpUtil.get('/linker-server/api/v1/cluster/resource-serial-data', {
        nodeId,
        queryType,
        queryRangeDay
      }).then(res => {
        const clusterResourceVO = res.data;
        let option = {
          title: {
            text: `${this.getClusterResourceQueryStr(queryType)}资源使用曲线`
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: clusterResourceVO.serialDataList.map(x => x.name)
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: clusterResourceVO.serialTimeList
          },
          yAxis: {
            type: 'value'
          },
          series: clusterResourceVO.serialDataList
        };
        // console.log(option);
        this.clusterResourceDashboardChart.clear();
        this.clusterResourceDashboardChart.setOption(option);
        this.clusterResourceDashboardLoading = false;
      }, res => {
        console.log(res);
      });
    },
    gotoInstanceList() {
      this.$router.push({
        path: `/home/instanceList`,
      })
    }
  },
  data() {
    return {
      instanceResourceTableData: [],
      clusterResourceTableData: [],
      specificationList: [],
      residentNotice: null,
      messageInboxList: [],
      messageDetailsDialogVisible: false,
      onlyUnReadMessage: false,
      messagePageSize: 8,
      messageInboxDetails: {
        msgTitle: '',
        msgContent: '',
        createTime: ''
      },
      messagePageSizeOptions: [
        {
          value: 8,
          label: '8条'
        }, {
          value: 16,
          label: '16条'
        }, {
          value: 32,
          label: '32条'
        }, {
          value: 64,
          label: '64条'
        }, {
          value: 128,
          label: '128条'
        }],

      clusterResourceDashboardLoading: false,
      clusterResourceDashboardChart: null,
      clusterResourceNodeId: null,
      clusterResourceQueryType: 'CPU',
      clusterResourceQueryTypeOptions: [
        {
          label: 'CPU使用率',
          value: 'CPU'
        },
        {
          label: 'CPU使用率详情',
          value: 'CPU_DETAILS'
        },
        {
          label: "内存使用率",
          value: 'MEMORY'
        }
      ],
      clusterResourceQueryRangeDay: 1,
      clusterResourceQueryRangeDayOptions: [
        {
          label: '最近1天',
          value: 1
        },
        {
          label: '最近2天',
          value: 2
        },
        {
          label: '最近3天',
          value: 3
        },
        {
          label: '最近4天',
          value: 4
        },
        {
          label: '最近5天',
          value: 5
        },
        {
          label: '最近6天',
          value: 6
        },
        {
          label: '最近7天',
          value: 7
        }
      ],
    }
  }
}
</script>

<style scoped lang="less">
@import "@/assets/style/common.less";

/deep/ .el-table .danger-row {
  background: #fab6b6;
}

/deep/ .el-table .warning-row {
  background: #f3d19e;
}

/deep/ .el-table .healthy-row {
  background: #b3e19d;
}

/deep/ .el-table .maintenance-row {
  background: #f56c6c;
}

#container {
  display: flex;
  flex-direction: column;

  #resident-notice-info {
    .card-item();
    width: 100%;
  }

  #instance-info {
    display: flex;

    #instance-number-block {
      width: 200px;
      height: 200px;
      color: gray;
      text-align: center;
      .card-item();

      #instance-number {
        color: black;
        font-size: 128px;
      }
    }

    #instance-resource-block {
      .card-item();
    }
  }

  #message-inbox {
    .card-item();
    width: 100%;
  }

  #cluster-info, #specification-info {
    .card-item();
    width: 100%;

    #clusterResourceDashboard {
      width: 100%;
      min-height: 512px;
      background-color: whitesmoke;
    }
  }

  #domainCheck {
    width: 100%;
    .card-item();
    display: flex;
    flex-direction: column;
  }
}
</style>
