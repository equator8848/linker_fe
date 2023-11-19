<template>
  <div id="container">
    <div id="header">
      <el-page-header @back="goBack" content="实例信息详情" title="返回"></el-page-header>
    </div>
    <div class="instance-info">
      <el-descriptions class="margin-top" :column="2" border>
        <template #title>
          <span style="margin: 2px">{{ instance.name }}</span>
          <el-icon v-clipboard:copy="instance.name" v-clipboard:success="copySuccess" v-clipboard:error="copyFail">
            <CopyDocument/>
          </el-icon>
        </template>
        <template #extra>
          <el-button type="warning"
                     @click="handleClickUpdateInstanceButton(instance,'STOP')"
                     v-show="showStopButton(instance)">停止
          </el-button>
          <el-button type="warning"
                     @click="handleClickPasswordButton(instance)">查看实例密码
          </el-button>
          <el-button type="info"
                     @click="handleClickUpdateInstanceButton(instance,'RESTART')"
                     v-show="showRestartButton(instance)">重启
          </el-button>
          <el-button type="warning"
                     @click="handleClickMigrateInstanceButton(instance)"
                     v-show="showMigrateButton(instance)">迁移
          </el-button>
          <el-button type="success"
                     @click="handleClickUpdateInstanceButton(instance,'START')"
                     v-show="showStartButton(instance)">启动
          </el-button>
          <el-button type="danger"
                     v-show="showSoftDeleteButton(instance)&&isSuperAdmin()"
                     @click="handleClickSoftDeleteInstance(instance)">软删除
          </el-button>
          <el-button type="primary"
                     v-show="showCancelSoftDeleteButton(instance)"
                     @click="handleClickCancelSoftDeleteInstance(instance)">取消软删除
          </el-button>
          <el-button type="primary"
                     v-show="showMarkCreateFailedButton(instance)"
                     @click="handleMarkCreateFailed(instance)">标记为创建失败
          </el-button>
          <el-button type="danger"
                     v-show="showHardDeleteButton(instance)&&isSuperAdmin()"
                     @click="handleDeleteInstance(instance)">硬删除
          </el-button>
          <el-button type="success"
                     @click="handleClickExecCommandButton(instance)"
                     v-show="showExecCommandButton(instance)">执行命令
          </el-button>
          <el-button type="info"
                     @click="handleClickShowOperationHistoryButton(instance)">查看操作历史
          </el-button>
          <el-button type="info"
                     @click="handleClickUpdateMaintenanceInfoButton(instance)">维护模式
          </el-button>
          <el-button type="info"
                     @click="handleClickUpdateRemarkButton(instance)">编辑备注
          </el-button>
          <el-button type="success"
                     @click="showInstanceResourceDashboard(instance)"
                     v-show="showExecCommandButton(instance)">资源监控
          </el-button>
        </template>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user/>
              </el-icon>
              用户
            </div>
          </template>
          {{ instance.uid }}
          <el-icon @click="gotoUserDetails(instance)">
            <Link/>
          </el-icon>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user/>
              </el-icon>
              用户官网ID
            </div>
          </template>
          <a :href="buildMofangUserDetailsUrl(instance)" target="_blank">{{ instance.userRelationId }}</a>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user/>
              </el-icon>
              实例ID
            </div>
          </template>
          {{ instance.id }}
          <el-icon v-clipboard:copy="instance.id" v-clipboard:success="copySuccess" v-clipboard:error="copyFail">
            <CopyDocument/>
          </el-icon>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <location/>
              </el-icon>
              所属节点
            </div>
          </template>
          {{ instance.clusterLocation }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <View/>
              </el-icon>
              运行状态
            </div>
          </template>
          <el-tag class="ml-2" :type="getInstanceStatusTagColor(instance)">{{ instance.instanceStatusStr }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <View/>
              </el-icon>
              实例初始化状态（未完成前ssh可能无法访问）
            </div>
          </template>
          <el-tag class="ml-2" :type="getInstanceInitStatusTagColor(instance)">{{
              instance.cloudInitStatusStr
            }}
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <iphone/>
              </el-icon>
              创建时间
            </div>
          </template>
          {{ instance.createTime }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <iphone/>
              </el-icon>
              更新时间
            </div>
          </template>
          {{ instance.updateTime }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Position/>
              </el-icon>
              IP地址（内网）
            </div>
          </template>
          {{ instance.ipv4Address }}
          <el-icon v-clipboard:copy="instance.ipv4Address" v-clipboard:success="copySuccess"
                   v-clipboard:error="copyFail">
            <CopyDocument/>
          </el-icon>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Link/>
              </el-icon>
              域名（公网）
            </div>
          </template>
          {{ instance.accessDomain }}
          <el-icon v-clipboard:copy="instance.accessDomain" v-clipboard:success="copySuccess"
                   v-clipboard:error="copyFail">
            <CopyDocument/>
          </el-icon>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <View/>
              </el-icon>
              资源套餐
            </div>
          </template>
          {{ instance.instanceSpecificationName }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <View/>
              </el-icon>
              镜像
            </div>
          </template>
          {{ instance.imageName }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Coin/>
              </el-icon>
              存储卷名称
            </div>
          </template>
          {{ instance.volumeName }}
          <el-icon v-clipboard:copy="instance.volumeName" v-clipboard:success="copySuccess"
                   v-clipboard:error="copyFail">
            <CopyDocument/>
          </el-icon>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Comment/>
              </el-icon>
              备注（用户界面不展示，用于管理员标记、搜索）
            </div>
          </template>
          {{ instance.remark }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <VideoPause/>
              </el-icon>
              是否进入维护模式
            </div>
          </template>
          <el-tag class="ml-2" :type="getInstanceMaintenanceModeTagColor(instance)">
            {{ instance.maintenanceMode ? "是" : "否" }}
          </el-tag>

        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <VideoPause/>
              </el-icon>
              维护原因
            </div>
          </template>
          {{ instance.maintenanceReason }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <View/>
              </el-icon>
              磁盘挂载状态
            </div>
          </template>
          <el-tag class="ml-2" :type="getInstanceVolumeStatusTagColor(instance)">{{
              instance.volumeCheckStatusStr
            }}
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <PieChart/>
              </el-icon>
              实例监控面板
            </div>
          </template>
          <a :href="instance.monitorUrl" target="_blank">点此跳转{{ instance.name }}实例监控面板</a>
        </el-descriptions-item>
      </el-descriptions>
      <div class="network-port-mapping">
        <el-table :data="instance.networkPortMappings" stripe border
                  style="width: 100%;height: 100%">
          <el-table-column label="公网端口">
            <template #default="scope">
              {{ scope.row.outsidePort }}
              <el-icon v-clipboard:copy="scope.row.outsidePort" v-clipboard:success="copySuccess"
                       v-clipboard:error="copyFail">
                <CopyDocument/>
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column
              label="内网端口"
              prop="insidePort">
          </el-table-column>

          <el-table-column label="端口用途（点击文字，浏览器新窗口打开链接）">
            <template #default="scope">
              <div v-if="buildLinkDisabledStatus(scope.row)">
                <span>{{ buildLinkText(scope.row) }}</span>
              </div>
              <div v-else>
                <span>{{ buildLinkText(scope.row) }}</span>
                <el-button type="info" size="small" v-clipboard:copy="buildLinkHref(instance, scope.row)"
                           v-clipboard:success="copySuccess"
                           v-clipboard:error="copyFail" style="margin-left: 4px">复制链接
                </el-button>
                <el-button type="primary" @click="jumpToNewTab(buildLinkHref(instance, scope.row))" size="small">
                  当前浏览器打开
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="执行简单命令" v-model="execCommandDialogVisible">
      <el-form :model="execCommandData" label-position="top">
        <el-form-item label="温馨提示" label-width="150px">
          <el-input type="text" model-value="此处只支持执行白名单中的简单非交互式指令，用于判断实例状态以及获取基本信息"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="执行命令" label-width="150px">
          <el-select v-model="execCommandData.commandTemplateId" placeholder="选择需要执行的命令（可以搜索）"
                     style="width: 100%"
                     :filterable="true"
                     @change="clearExecCommandOutput">
            <el-option
                v-for="item in instanceCommandExecOptions"
                :key="item.command"
                :label="getCommandLabel(item)"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行结果(StdOut)" label-width="150px" v-show="this.execCommandData.execCommandStdOutput">
          <div class="exec-command-result">
            {{ this.execCommandData.execCommandStdOutput }}
          </div>
        </el-form-item>
        <el-form-item label="执行结果(StdErr)" label-width="150px" v-show="this.execCommandData.execCommandStdError">
          <div class="exec-command-result">
            {{ this.execCommandData.execCommandStdError }}
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="warning" @click="execCommandDialogVisible = false">关闭</el-button>
        <el-button type="info" v-clipboard:copy="getCurrentCommand()" v-clipboard:success="copySuccess"
                   v-clipboard:error="copyFail">复制当前命令
        </el-button>
        <el-button type="primary" @click="handleExecCommand" :loading="execCommandData.loading">执行</el-button>
      </template>
    </el-dialog>

    <el-dialog title="迁移实例" v-model="migrateDialogVisible">
      <el-form :model="instanceMigrateInfo">
        <el-form-item label="将迁移的实例" label-width="200px">
          <el-input
              placeholder="实例名称"
              v-model="instanceMigrateInfo.instanceName"
              :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="按照套餐限制迁移节点" label-width="200px">
          <el-switch v-model="instanceMigrateInfo.checkPlan"/>
        </el-form-item>
        <el-form-item label="当前实例套餐" label-width="200px">
          <el-input
              placeholder="实例套餐"
              v-model="instanceMigrateInfo.planingStr"
              :disabled="true">
          </el-input>
        </el-form-item>

        <el-form-item label="当前所在节点" label-width="200px">
          <el-input
              placeholder="当前所在节点"
              v-model="instanceMigrateInfo.locationNodeDisplayName"
              :disabled="true">
          </el-input>
        </el-form-item>

        <el-form-item label="目标节点" label-width="200px">
          <el-select v-model="instanceMigrateInfo.nodeId" placeholder="请选择目标节点（推荐选择负载低的）"
                     style="width: 100%">
            <el-option
                v-for="item in clusters"
                :key="item.nodeId"
                :label="getNodeLabel(item)"
                :disabled="getDisableStatus(item)"
                :value="item.nodeId">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <template #footer>
        <el-button type="info" @click="migrateDialogVisible = false">关闭</el-button>
        <el-button type="warning" @click="handleMigrateInstance()">迁移</el-button>
      </template>
    </el-dialog>

    <el-dialog title="恢复软删除的实例" v-model="cancelSoftDeleteInstanceData.dialogVisible">
      <el-form :model="cancelSoftDeleteInstanceData">
        <el-form-item label="需要恢复的实例" label-width="200px">
          <el-input
              placeholder="实例名称"
              v-model="instance.name"
              :disabled="true">
          </el-input>
        </el-form-item>

        <el-form-item label="需要恢复的存储卷" label-width="200px">
          <el-select v-model="cancelSoftDeleteInstanceData.volumeId"
                     placeholder="请选择关联的数据盘，可从实例操作历史备注中找到对应ID"
                     style="width: 100%">
            <el-option
                v-for="item in cancelSoftDeleteInstanceData.volumeOptions"
                :key="item.id"
                :label="getVolumeLabel(item)"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注（必填）" label-width="200px">
          <el-input
              placeholder="输入恢复原因"
              v-model="cancelSoftDeleteInstanceData.remark">
          </el-input>
        </el-form-item>

      </el-form>
      <template #footer>
        <el-button type="info" @click="cancelSoftDeleteInstanceData.dialogVisible = false">关闭</el-button>
        <el-button type="warning" @click="handleCancelSoftDeleteInstance">恢复实例</el-button>
      </template>
    </el-dialog>

    <el-dialog title="查看实例账号信息" v-model="passwordDialogVisible">
      <el-form :model="instanceAccountInfo">
        <el-form-item label="温馨提示" label-width="150px">
          <el-input type="text" model-value="如需修改实例密码请在登录后在终端里修改，本系统不作保存" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名" label-width="150px">
          <el-input type="text" v-model="instanceAccountInfo.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="150px">
          <el-input type="password" show-password v-model="instanceAccountInfo.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="passwordDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="updateInstanceStatusData.updateInstanceStateVisible" title="实例状态调整">
      <el-form label-position="top">
        <el-form-item label="温馨提示：" label-width="150px">
          <div class="danger-tips">
            运行大任务的时候不要中途重启过实例，这样会导致实例卡住，具体表现是网页无法获取实例详情，SSH无法连接等。和平常使用电脑一样，电脑高负荷运转的时候，突然断电，谁也无法预料后续会发生什么。
          </div>
        </el-form-item>
        <el-form-item label="确认是否继续当前操作？" label-width="150px">
          <div class="warn-tips">
            {{ this.operationMapping[updateInstanceStatusData.targetStatus] }} 实例
            {{ this.updateInstanceStatusData.instance.name }}
          </div>
        </el-form-item>
        <el-form-item label="是否强制停止或重启" label-width="150px">
          <el-switch v-model="updateInstanceStatusData.force"/>
        </el-form-item>
        <el-form-item label="操作原因" label-width="150px">
          <el-input v-model="updateInstanceStatusData.remark"/>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="updateInstanceStatusData.updateInstanceStateVisible = false">取消操作</el-button>
        <el-button type="warning" @click="doUpdateInstanceState">
          确定
        </el-button>
      </span>
      </template>
    </el-dialog>

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

    <el-dialog v-model="updateMaintenanceData.updateMaintenanceDialogVisible" title="实例维护信息维护">
      <el-form label-position="left">
        <el-form-item label="进入维护模式">
          <el-switch v-model="updateMaintenanceData.maintenanceMode"/>
        </el-form-item>
      </el-form>
      <el-form-item label="维护原因">
        <el-input v-model="updateMaintenanceData.maintenanceReason" autocomplete="off"></el-input>
      </el-form-item>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="updateMaintenanceData.updateMaintenanceDialogVisible = false">取消操作</el-button>
        <el-button type="warning" @click="doUpdateMaintenanceInfo">
          确定
        </el-button>
      </span>
      </template>
    </el-dialog>

    <el-dialog v-model="softDeleteInstanceData.deleteInstanceDialogVisible" title="确认删除实例" center>
      <el-input v-model="softDeleteInstanceData.instanceNameConfirm" style="margin-top: 8px"
                placeholder="请输入您要删除的实例名称以确认本次操作"
                clearable/>
      <el-checkbox v-model="softDeleteInstanceData.deleteVolume" style="margin-top: 8px">
        删除数据存储卷（如果保留数据存储卷，则只删除系统盘，下次创建实例时将会挂载此数据存储卷）
      </el-checkbox>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="softDeleteInstanceData.deleteInstanceDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="doSoftDeleteInstance">
          确认删除
        </el-button>
      </span>
      </template>
    </el-dialog>

    <el-dialog v-model="instanceResourceDashboardVisible" title="实例资源可视化面板">
      <el-select v-model="instanceResourceQueryRangeDay" placeholder="查询范围" style="padding: 4px"
                 @change="initInstanceResourceDashboardData(this.instanceResourceInstanceName,this.instanceResourceQueryType,this.instanceResourceQueryRangeDay)">
        <el-option
            v-for="item in instanceResourceQueryRangeDayOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="instanceResourceQueryType" placeholder="请选择查询类型" style="padding: 4px"
                 @change="initInstanceResourceDashboardData(this.instanceResourceInstanceName,this.instanceResourceQueryType,this.instanceResourceQueryRangeDay)">
        <el-option
            v-for="item in instanceResourceQueryTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <div id="instanceResourceDashboard"></div>
    </el-dialog>
  </div>
</template>

<script>
import {clearStatus, instanceStatus, instanceVolumeStatus, instanceCloudInitStatus} from '@/common/constant'
import {getPlaningStr, getPlaningStrList} from '@/common/format'
import {isSuperAdmin} from '@/common/roleTypeAuth'

import * as echarts from 'echarts/core';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import {LineChart} from 'echarts/charts';
import {UniversalTransition} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use([GridComponent, TitleComponent, ToolboxComponent, TooltipComponent, LegendComponent,
  LineChart, UniversalTransition, CanvasRenderer]);

export default {
  name: "InstanceList",
  inject: ['reload'],
  mounted() {
    this.instanceId = this.$route.params.instanceId;
    this.getInstanceDetails();
  },
  unmounted() {
    if (this.instanceResourceDashboardChart) {
      this.instanceResourceDashboardChart.dispose();
    }
  },
  data() {
    return {
      instanceId: 0,
      instance: {},
      operationHistoryVisible: false,
      operationHistoryList: [],
      execCommandDialogVisible: false,
      instanceCommandExecOptions: [],
      updateInstanceStatusData: {
        updateInstanceStateVisible: false,
        instance: null,
        targetStatus: null,
        force: false,
        remark: ''
      },
      updateMaintenanceData: {
        updateMaintenanceDialogVisible: false,
        instanceId: null,
        maintenanceMode: false,
        maintenanceReason: '管理员正在维护操作该实例'
      },
      softDeleteInstanceData: {
        deleteInstanceDialogVisible: false,
        instanceId: null,
        instanceName: '',
        instanceNameConfirm: '',
        deleteVolume: true
      },
      passwordDialogVisible: false,
      instanceAccountInfo: {
        instanceId: 0,
        username: null,
        password: null
      },
      operationMapping: {
        'START': '启动',
        'STOP': '停止',
        'RESTART': '重启'
      },
      execCommandData: {
        loading: false,
        instanceId: null,
        commandTemplateId: null,
        command: '',
        execCommandStdOutput: '',
        execCommandStdError: '',
      },
      clusters: [],
      migrateDialogVisible: false,
      instanceMigrateInfo: {
        instanceId: null,
        instanceName: null,
        currentNodeId: null,
        locationNodeDisplayName: null,
        planing: 0,
        planingStr: null,
        checkPlan: true,
        nodeId: null
      },
      cancelSoftDeleteInstanceData: {
        dialogVisible: false,
        volumeOptions: [],
        instanceId: null,
        volumeId: null,
        remark: ''
      },

      instanceResourceDashboardVisible: false,
      instanceResourceDashboardChart: null,
      instanceResourceInstanceName: null,
      instanceResourceQueryType: 'CPU',
      instanceResourceQueryTypeOptions: [
        {
          label: 'CPU使用率',
          value: 'CPU'
        },
        {
          label: '内存使用量',
          value: 'MEMORY'
        },
        {
          label: '实例进程量',
          value: 'PROCESS'
        },
        {
          label: '硬盘空间使用率',
          value: 'DISK'
        }
      ],
      instanceResourceQueryRangeDay: 1,
      instanceResourceQueryRangeDayOptions: [
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
        }
      ]
    }
  },
  methods: {
    isSuperAdmin() {
      return isSuperAdmin();
    },
    goBack() {
      this.$router.back();
    },
    buildLinkHref(instance, item) {
      return `http://${instance.accessDomain}:${item.outsidePort}`;
    },
    getInstanceVolumeStatusTagColor(instance) {
      let status = instance.volumeCheckStatus;
      if (instanceVolumeStatus.NORMAL === status) {
        return 'success'
      } else if (instanceVolumeStatus.UNKNOWN === status) {
        return 'info'
      } else if (instanceVolumeStatus.ERROR === status) {
        return 'danger'
      }
      return ''
    },
    getVolumeByUserId() {
      this.$httpUtil.get('/api/v1/volume/list-by-user-id', {
        userId: this.instance.uid
      }).then(res => {
        if (res) {
          let response = res.data;
          this.cancelSoftDeleteInstanceData.volumeOptions = response.data;
        }
      }, (res) => {
        console.log(res);
      });
    },
    getInstanceStatusTagColor(instance) {
      let status = instance.instanceStatus;
      if (instanceStatus.RUNNING === status) {
        return 'success'
      } else if (instanceStatus.STOP === status) {
        return 'info'
      } else if (instanceStatus.ERROR === status) {
        return 'danger'
      }
      return ''
    },
    getInstanceMaintenanceModeTagColor(instance) {
      let maintenanceMode = instance.maintenanceMode;
      if (maintenanceMode) {
        return 'warning'
      }
      return 'success'
    },
    getInstanceInitStatusTagColor(instance) {
      let status = instance.cloudInitStatus;
      if (instanceCloudInitStatus.DONE === status) {
        return 'success'
      } else if (instanceCloudInitStatus.UNKNOWN === status) {
        return 'info'
      } else if (instanceCloudInitStatus.ERROR === status) {
        return 'danger'
      }
      return ''
    },
    getNodeLabel(item) {
      return `${item.displayName}(CPU使用率 ${item.cpuUsage.toFixed(2)}%，
      内存使用率 ${item.memoryUsage.toFixed(2)}%，系统15分钟平均负载：${item.nodeLoadAvg15}，可以使用此节点的套餐：${getPlaningStrList(item.allowPlannings)})`;
    },
    getVolumeLabel(item) {
      return `${item.name}(ID：{${item.id}，更新时间：${item.updateTime}，关联实例：${item.instanceId})`;
    },
    getDisableStatus(clusterNode) {
      if (!this.instanceMigrateInfo.checkPlan) {
        return false;
      }
      return clusterNode.allowPlannings.indexOf(this.instanceMigrateInfo.planing) === -1;
    },
    buildLinkText(item) {
      return item.portPurpose;
    },
    buildLinkDisabledStatus(item) {
      if (item.insidePort === 22) {
        return true;
      }
      return false;
    },
    showStopButton(instance) {
      return instance.instanceStatus === instanceStatus.RUNNING;
    },
    showStartButton(instance) {
      return instance.instanceStatus === instanceStatus.STOP;
    },
    showMigrateButton(instance) {
      return instance.instanceStatus === instanceStatus.STOP;
    },
    showRestartButton(instance) {
      return instance.instanceStatus === instanceStatus.RUNNING;
    },
    showMarkCreateFailedButton(instance) {
      return instance.instanceStatus === instanceStatus.INIT;
    },
    showHardDeleteButton(instance) {
      return clearStatus.NEED_CLEAR === instance.clearStatus && instance.canHardDelete;
    },
    showCancelSoftDeleteButton(instance) {
      return clearStatus.NEED_CLEAR === instance.clearStatus;
    },
    showSoftDeleteButton(instance) {
      return instance.canSoftDelete && clearStatus.NO_NEED_CLEAR === instance.clearStatus;
    },
    showExecCommandButton(instance) {
      return instance.instanceStatus === instanceStatus.RUNNING;
    },
    getCommandLabel(item) {
      return `${item.command}(${item.commandDescription})`;
    },
    clearExecCommandOutput() {
      this.execCommandData.execCommandStdOutput = '';
      this.execCommandData.execCommandStdError = '';
    },
    gotoUserDetails(item) {
      this.$router.push({
        path: `/home/userDetails/${item.uid}`,
      })
    },
    buildMofangUserDetailsUrl(item) {
      return `https://www.xiyoucloud.net/lihongjiang/#/customer-view/abstract?id=${item.userRelationId}`;
    },
    handleClickExecCommandButton(instance) {
      this.$httpUtil.get('/api/v1/command-template/list', {}).then(res => {
        if (res) {
          this.instanceCommandExecOptions = res.data;
        }
      }, res => {
        console.log(res);
      });
      this.execCommandDialogVisible = true;
      this.execCommandData.instanceId = instance.id;
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
    handleClickUpdateMaintenanceInfoButton(instance) {
      this.updateMaintenanceData.instanceId = instance.id;
      this.updateMaintenanceData.maintenanceMode = instance.maintenanceMode;
      this.updateMaintenanceData.maintenanceReason = instance.maintenanceReason;
      this.updateMaintenanceData.updateMaintenanceDialogVisible = true;
    },
    doUpdateMaintenanceInfo() {
      let param = this.updateMaintenanceData;
      this.$httpUtil.jsonPut('/api/v1/instance/update-maintenance-info', {
        instanceId: param.instanceId,
        maintenanceMode: param.maintenanceMode,
        maintenanceReason: param.maintenanceReason
      }).then(res => {
        if (res) {
          this.$notify.success({
            title: '成功',
            message: '成功更新维护信息'
          });
          this.reload();
        }
      }, (res) => {
        console.log(res);
      });
    },
    handleClickUpdateRemarkButton(instance) {
      this.$prompt('请输入新的备注', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        this.$httpUtil.jsonPut('/api/v1/instance/update-remark', {
          instanceId: instance.id,
          remark: value
        }).then(res => {
          if (res) {
            this.$notify.success({
              title: '成功',
              message: '成功更新备注'
            });
            this.reload();
          }
        }, (res) => {
          console.log(res);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    handleClickMigrateInstanceButton(instance) {
      this.migrateDialogVisible = true;
      this.instanceMigrateInfo.instanceId = instance.id;
      this.instanceMigrateInfo.instanceName = instance.name;
      this.instanceMigrateInfo.currentNodeId = instance.clusterLocation;
      this.instanceMigrateInfo.locationNodeDisplayName = instance.locationNodeDisplayName;
      this.instanceMigrateInfo.planing = instance.planing;
      this.instanceMigrateInfo.planingStr = getPlaningStr(instance.planing);
      this.getCluster(instance.clusterLocation);
    },
    getCluster(currentNodeId) {
      this.$httpUtil.get('/api/v1/cluster/resource-data', {}).then(res => {
        if (res.status === 0) {
          this.clusters = res.data.nodeResources.filter(c => {
            return c.nodeId !== currentNodeId && c.maintenanceMode !== true && c.memoryUsage && c.cpuUsage
          });
        }
      }, res => {
        console.log(res);
      });
    },
    getCurrentCommand() {
      const selectCommand = this.instanceCommandExecOptions.find(x => x.id === this.execCommandData.commandTemplateId);
      if (!selectCommand) {
        return '';
      }
      this.execCommandData.command = selectCommand.command;
      return selectCommand.command;
    },
    handleExecCommand() {
      if (!this.execCommandData.commandTemplateId) {
        this.$notify.warning({
          title: '错误',
          message: '请选择需要执行的命令'
        });
        return;
      }
      this.execCommandData.loading = true;
      this.$httpUtil.jsonPost('/api/v1/instance/exec-command', {
        instanceId: this.execCommandData.instanceId,
        commandTemplateId: this.execCommandData.commandTemplateId,
        command: this.execCommandData.command
      }).then(res => {
        if (res) {
          this.$notify.success({
            title: '成功',
            message: '命令执行成功'
          });
          this.execCommandData.execCommandStdOutput = res.data.stdOutput;
          this.execCommandData.execCommandStdError = res.data.stdError;
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        this.execCommandData.loading = false;
      });
    },
    doDeleteInstance(instance) {
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
      }).finally(() => {
        loading.close();
        setTimeout(() => {
          this.reload();
        }, 1500);
      });
    },
    doSoftDeleteInstance() {
      let deleteInstanceData = this.softDeleteInstanceData;
      if (deleteInstanceData.instanceName !== deleteInstanceData.instanceNameConfirm) {
        this.$notify.error({
          title: '实例名称不匹配',
          message: `您输入的实例名称是${deleteInstanceData.instanceNameConfirm}，但是您当前操作的实例是${deleteInstanceData.instanceName}`
        });
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: '操作中，请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$httpUtil.jsonPut('/api/v1/instance/delete', {
        instanceId: deleteInstanceData.instanceId,
        deleteVolume: this.softDeleteInstanceData.deleteVolume
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
        loading.close();
        this.softDeleteInstanceData.deleteInstanceDialogVisible = false;
        setTimeout(() => {
          this.refresh();
        }, 1500);
      });
    },
    refresh() {
      this.reload();
    },
    handleDeleteInstance(instance) {
      this.$confirm('删除实例会删除所有相关数据，操作不可逆，是否继续？', '高危操作', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        this.doDeleteInstance(instance);
      }).catch(() => {
        //
      });
    },
    handleClickSoftDeleteInstance(instance) {
      this.softDeleteInstanceData.instanceId = instance.id;
      this.softDeleteInstanceData.instanceName = instance.name;
      this.softDeleteInstanceData.deleteInstanceDialogVisible = true;
    },
    handleClickCancelSoftDeleteInstance(instance) {
      this.cancelSoftDeleteInstanceData.instanceId = instance.id;
      this.cancelSoftDeleteInstanceData.dialogVisible = true;
      this.getVolumeByUserId();
    },
    handleMarkCreateFailed(instance) {
      this.$confirm('准备将此实例标记为创建失败，是否继续？', '确认', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        this.$httpUtil.urlEncoderPut('/api/v1/instance/mark-as-create-failed', {
          instanceId: instance.id,
        }).then(res => {
          if (res) {
            this.$notify.success({
              title: '成功',
              message: '已将实例标记为创建失败，请提醒用户删除实例以及存储卷后重新创建'
            });
            this.reload();
          }
        }, (res) => {
          console.log(res);
        });
      }).catch(() => {
        //
      });
    },
    handleClickPasswordButton(instance) {
      this.instanceAccountInfo.instanceId = instance.id;
      this.passwordDialogVisible = true;
      this.$httpUtil.get('/api/v1/instance/get-password', {
        instanceId: instance.id,
      }).then(res => {
        if (res) {
          let accountData = res.data;
          this.instanceAccountInfo.username = accountData.username;
          this.instanceAccountInfo.password = accountData.password;
        }
      }, res => {
        console.log(res);
      });
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
    handleCancelSoftDeleteInstance() {
      this.$httpUtil.jsonPost('/api/v1/instance/cancel-delete', {
        instanceId: this.cancelSoftDeleteInstanceData.instanceId,
        volumeId: this.cancelSoftDeleteInstanceData.volumeId,
        remark: this.cancelSoftDeleteInstanceData.remark
      }).then(res => {
            if (res) {
              this.$notify.success({
                title: '成功',
                message: '恢复成功'
              });
            }
          }, res => {
            console.log(res);
          }
      ).finally(() => {
        setTimeout(() => {
          this.refresh();
        }, 1500);
      });
    },
    handleMigrateInstance() {
      const loading = this.$loading({
        lock: true,
        text: '操作中，请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$httpUtil.jsonPut('/api/v1/instance/migrate', {
        instanceId: this.instanceMigrateInfo.instanceId,
        nodeId: this.instanceMigrateInfo.nodeId
      }).then(res => {
            if (res) {
              this.$notify.success({
                title: '成功',
                message: '迁移成功'
              });
            }
          }, res => {
            console.log(res);
          }
      ).finally(() => {
        loading.close();
        setTimeout(() => {
          this.refresh();
        }, 1500);
      });
    },
    handleClickUpdateInstanceButton(instance, state) {
      this.updateInstanceStatusData.updateInstanceStateVisible = true;
      this.updateInstanceStatusData.instance = instance;
      this.updateInstanceStatusData.targetStatus = state;
    },
    doUpdateInstanceState() {
      const instance = this.updateInstanceStatusData.instance;
      const state = this.updateInstanceStatusData.targetStatus;
      const force = this.updateInstanceStatusData.force;
      const remark = this.updateInstanceStatusData.remark;
      const loading = this.$loading({
        lock: true,
        text: '操作中，请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$httpUtil.jsonPost('/api/v1/instance/update-state', {
        instanceId: instance.id,
        state: state,
        force: force,
        remark
      }).then(res => {
        if (res) {
          this.$notify.success({
            title: '成功',
            message: '操作成功'
          });
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        loading.close();
        this.updateInstanceStatusData.updateInstanceStateVisible = false
        setTimeout(() => {
          this.refresh();
        }, 1500);
      });
    },
    getInstanceDetails() {
      this.$httpUtil.get('/api/v1/instance/details', {
        instanceId: this.instanceId
      }).then(res => {
        if (res) {
          this.instance = res.data;
        }
      }, (res) => {
        console.log(res);
      });
    },
    jumpToNewTab(url) {
      window.open(url, '_blank');
    },
    showInstanceResourceDashboard(instance) {
      this.instanceResourceDashboardVisible = true;
      this.$nextTick(() => {
        const chartDom = document.getElementById('instanceResourceDashboard');
        if (!chartDom) {
          return;
        }
        if (!this.instanceResourceDashboardChart) {
          this.instanceResourceDashboardChart = echarts.init(chartDom);
        }
        this.instanceResourceInstanceName = instance.name;
        this.initInstanceResourceDashboardData(instance.name, 'CPU', 1);
      });
    },
    getInstanceResourceQueryStr(queryType) {
      switch (queryType) {
        case 'CPU':
          return 'CPU';
        case 'MEMORY':
          return '内存';
        case 'PROCESS':
          return '进程数量';
        case 'DISK':
          return '磁盘';
        default:
          return '未知';
      }
    },
    initInstanceResourceDashboardData(instanceName, queryType, queryRangeDay) {
      this.$httpUtil.get('/api/v1/instance/resource-data', {
        instanceName,
        queryType,
        queryRangeDay
      }).then(res => {
        const instanceResourceVO = res.data;
        let option = {
          title: {
            text: `${this.getInstanceResourceQueryStr(queryType)}资源使用曲线`
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: instanceResourceVO.serialDataList.map(x => x.name)
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
            data: instanceResourceVO.serialTimeList
          },
          yAxis: {
            type: 'value'
          },
          series: instanceResourceVO.serialDataList
        };
        console.log(option);
        this.instanceResourceDashboardChart.clear();
        this.instanceResourceDashboardChart.setOption(option);
      }, res => {
        console.log(res);
      });
    }
  }
}
</script>

<style scoped lang="less">
#container {
  display: flex;
  flex-direction: column;

  #header {
    background-color: whitesmoke;
    height: 50px;
    display: flex;
    align-items: center;
  }

  .instance-info {
    background-color: whitesmoke;
    margin-top: 8px;
    border-radius: 8px;
    padding: 8px;
    display: flex;
    flex-direction: column;

    .network-port-mapping {
      margin-top: 4px;
    }
  }
}

.exec-command-result {
  background-color: black;
  color: white;
  padding: 4px;
  border-radius: 4px;
  width: 100%;
  white-space: pre-wrap;
}

#operation-board {
  display: flex;
  justify-content: space-between;
}

.warn-tips {
  color: white;
  background-color: #E6A23C;
  padding: 4px;
  border-radius: 4px;
}

.danger-tips {
  color: white;
  background-color: #F56C6C;
  padding: 4px;
  border-radius: 4px;
}

#instanceResourceDashboard {
  width: 100%;
  min-height: 512px;
  background-color: whitesmoke;
}
</style>
