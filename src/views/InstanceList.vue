<template>
  <div id="container">
    <el-empty description="空空如也" v-show="instances.length===0" class="instance-info">
      <router-link to='/home/imageMarket' style="text-decoration: none;color: gray">没有实例，点此去创建实例
      </router-link>
    </el-empty>
    <el-tabs type="border-card">
      <el-tab-pane v-for="instance in instances" :key="instance.id">
        <template #label>
          <div style="padding-top: 4px">
            <el-badge is-dot class="item" :type="getBadgeType(instance)">{{ instance.name }}</el-badge>
          </div>
        </template>
        <div class="instance-info">
          <el-descriptions class="margin-top" :column="2" border>
            <template #title>
              <div style="display: flex;align-items: center">
                <el-tag class="ml-2"
                        v-show="instance.userRemark"
                        type="primary">{{ instance.userRemark }}
                </el-tag>
                <span style="margin: 2px">{{ instance.name }}</span>
                <el-icon v-clipboard:copy="instance.name" v-clipboard:success="copySuccess"
                         v-clipboard:error="copyFail">
                  <CopyDocument/>
                </el-icon>
              </div>
            </template>
            <template #extra>
              <el-button type="info"
                         @click="handleClickShowOperationHistoryButton(instance)">查看操作历史
              </el-button>
              <el-button type="warning"
                         @click="handleClickUpdateInstanceButton(instance,'STOP')"
                         v-show="showStopButton(instance)">停止
              </el-button>
              <el-button type="danger"
                         v-show="showDeleteButton(instance)"
                         @click="handleClickDeleteInstanceButton(instance)">删除
              </el-button>
              <el-button type="warning"
                         @click="handleClickPasswordButton(instance)"
                         v-show="showPasswordButton(instance)">查看实例密码
              </el-button>
              <el-button type="info"
                         @click="handleClickUpdateInstanceButton(instance,'RESTART')"
                         v-show="showRestartButton(instance)">重启
              </el-button>
              <el-button type="success"
                         @click="handleClickExecCommandButton(instance)"
                         v-show="showExecCommandButton(instance)">命令执行器
              </el-button>
              <el-button type="success"
                         @click="showInstanceResourceDashboard(instance)"
                         v-show="showExecCommandButton(instance)">资源监控
              </el-button>
              <el-button type="warning"
                         @click="handleClickMigrateInstanceButton(instance)"
                         v-show="showMigrateButton(instance)">迁移
              </el-button>
              <el-button type="success"
                         @click="handleClickUpdateInstanceButton(instance,'START')"
                         v-show="showStartButton(instance)">启动
              </el-button>
              <el-button type="info"
                         @click="handleClickUpdateRemarkButton(instance)">编辑备注
              </el-button>
            </template>
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
                  <el-popover
                      placement="top-start"
                      title="实例所属节点状态说明"
                      trigger="hover"
                      width="512">
                    <template #reference>
                      <el-icon>
                        <QuestionFilled/>
                      </el-icon>
                    </template>
                    <ul style="padding: 12px">
                      <li>
                        节点如果是离线状态，可能是节点被跑崩了，此时是无法手动停止实例的，等待十分钟左右系统会自动停止实例，之后就可以迁移到其它节点了。
                      </li>
                      <li>
                        节点如果是拥挤的状态，说明此节点上面运行的实例数量比较多，如果要分析大任务的时候可以迁移到其它节点使用。
                      </li>
                    </ul>
                  </el-popover>
                </div>
              </template>
              {{ instance.locationNodeDisplayName }}
              <el-tag class="ml-2 instance-node-status-tag" :type="getNodeLoadStatusColor(instance.nodeResourceInfo)">{{
                  getNodeLoadStatusStr(instance.nodeResourceInfo)
                }}
              </el-tag>
              <el-tag class="ml-2 instance-node-status-tag" :type="getNodeStatusTagColor(instance.nodeResourceInfo)">{{
                  instance.nodeResourceInfo.isActive ? "在线" : "离线"
                }}
              </el-tag>
              <el-tag class="ml-2 instance-node-status-tag"
                      :type="getNodeIsCrowdedStatusTagColor(instance.nodeResourceInfo)"
                      v-show="instance.nodeResourceInfo.isCrowded">拥挤
              </el-tag>
            </el-descriptions-item>

            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Connection/>
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
                    <Tickets/>
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
                    <Clock/>
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
                    <Clock/>
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
                  <el-popover
                      placement="top-start"
                      title="备用域名，文件传输专用域名"
                      :width="200"
                      trigger="hover"
                      content="ctcc1.xiyoucloud.pro、ctcc2.xiyoucloud.pro、ctcc3.xiyoucloud.pro">
                    <template #reference>
                      <el-icon>
                        <QuestionFilled/>
                      </el-icon>
                    </template>
                  </el-popover>
                </div>
              </template>
              {{ this.baseDomain }}
              <el-icon v-clipboard:copy="this.baseDomain" v-clipboard:success="copySuccess"
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
                    <Bell/>
                  </el-icon>
                  安全风险警告
                </div>
              </template>
              <span style="color: red" v-show="getSecurityWarning(instance)">{{ getSecurityWarning(instance) }}</span>
            </el-descriptions-item>

            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Bell/>
                  </el-icon>
                  备注
                </div>
              </template>
              <span style="color: red" v-show="isShowRemark(instance)">{{ instance.remark }}</span>
            </el-descriptions-item>


          </el-descriptions>
          <el-divider content-position="center">端口映射配置</el-divider>
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

              <el-table-column label="端口说明">
                <template #default="scope">
                  <div>
                    <span v-html="buildPortTips(scope.row)"></span>
                    <el-icon>
                      <TopRight/>
                    </el-icon>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="端口用途">
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
                      新窗口打开
                    </el-button>
                  </div>
                </template>
              </el-table-column>

            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

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

    <el-dialog title="执行简单命令" v-model="execCommandDialogVisible">
      <el-form :model="instanceAccountInfo" label-position="top">
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
        <el-button v-clipboard:copy="getCurrentCommand()" v-clipboard:success="copySuccess"
                   v-clipboard:error="copyFail">复制当前命令
        </el-button>
        <el-button type="primary" @click="handleExecCommand" :loading="execCommandData.loading">执行</el-button>
      </template>
    </el-dialog>

    <el-dialog title="迁移实例" v-model="migrateDialogVisible">
      <el-form :model="instanceMigrateInfo">
        <el-form-item label="将迁移的实例" label-width="120px">
          <el-input
              placeholder="实例名称"
              v-model="instanceMigrateInfo.instanceName"
              :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="当前实例套餐" label-width="120px">
          <el-input
              placeholder="实例套餐"
              v-model="instanceMigrateInfo.planingStr"
              :disabled="true">
          </el-input>
        </el-form-item>

        <el-form-item label="当前所在节点" label-width="120px">
          <el-input
              placeholder="当前所在节点"
              v-model="instanceMigrateInfo.locationNodeDisplayName"
              :disabled="true">
          </el-input>
        </el-form-item>

        <el-form-item label="目标节点" label-width="120px">
          <el-select v-model="instanceMigrateInfo.nodeId" placeholder="请选择目标节点（推荐选择负载低的）"
                     style="width: 100%">
            <el-option
                v-for="item in clusters"
                :key="item.nodeId"
                :disabled="getDisableStatus(item)"
                :label="getNodeLabel(item)"
                :value="item.nodeId">
              <div style="display: flex;justify-content: space-between">
                <div>
                  <el-tag class="ml-2"
                          :type="getNodeLoadStatusColor(item)">
                    {{ getNodeLoadStatusStr(item) }}
                  </el-tag>
                  <el-tag class="ml-2"
                          v-show="item.isCrowded"
                          :type="getNodeIsCrowdedStatusTagColor(item)">拥挤
                  </el-tag>
                </div>
                <span style="float: left">{{ getNodeLabel(item) }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <template #footer>
        <el-button type="info" @click="migrateDialogVisible = false">关闭</el-button>
        <el-button type="warning" @click="handleMigrateInstance()">迁移</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="deleteInstanceData.deleteInstanceDialogVisible" title="确认删除实例" center>
      <el-input placeholder="实例删除操作有次数限制，请勿频繁操作"
                disabled/>
      <el-input v-model="deleteInstanceData.instanceNameConfirm" style="margin-top: 8px"
                placeholder="请输入您要删除的实例名称以确认本次操作"
                clearable/>
      <el-checkbox v-model="deleteInstanceData.deleteVolume" style="margin-top: 8px">
        删除数据存储卷（如果保留数据存储卷，则只删除系统盘，下次创建实例时将会挂载此数据存储卷）
      </el-checkbox>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteInstanceData.deleteInstanceDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="doDeleteInstance">
          确认删除
        </el-button>
      </span>
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
        <el-form-item label="是否强制停止或重启（谨慎选择，有几率导致文件系统损坏）" label-width="150px">
          <el-switch v-model="updateInstanceStatusData.force"/>
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
      <div id="instanceResourceDashboard" v-loading="instanceResourceDashboardLoading"></div>
    </el-dialog>
  </div>
</template>

<script>
import {
  commonSettings,
  instanceStatus,
  instanceCloudInitStatusStr,
  instanceCloudInitStatus,
  instanceVolumeStatus,
  serverDomain
} from '@/common/constant'
import {getPlaningStr} from '@/common/format'
import {useStore} from "vuex";
import Throttle from "@/common/throttle";
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
  data() {
    return {
      passwordDialogVisible: false,
      migrateDialogVisible: false,
      execCommandDialogVisible: false,
      operationHistoryVisible: false,

      instanceResourceDashboardLoading: false,
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
        },
        {
          label: '最近7天',
          value: 7
        }
      ],
      operationHistoryList: [],
      updateInstanceStatusData: {
        updateInstanceStateVisible: false,
        instance: null,
        targetStatus: null,
        force: false
      },
      execCommandData: {
        loading: false,
        instanceId: null,
        command: '',
        commandTemplateId: null,
        execCommandStdOutput: '',
        execCommandStdError: '',
      },
      deleteInstanceData: {
        deleteInstanceDialogVisible: false,
        instanceId: null,
        instanceName: '',
        instanceNameConfirm: '',
        deleteVolume: false
      },
      search: '',
      addUserForm: {
        userName: '',
        userPassword: ''
      },
      clusters: [],
      instances: [],
      instanceAccountInfo: {
        instanceId: 0,
        username: null,
        password: null
      },
      instanceCommandExecOptions: [],
      instanceMigrateInfo: {
        instanceId: null,
        instanceName: null,
        currentNodeId: null,
        locationNodeDisplayName: null,
        planing: 0,
        planingStr: null,
        nodeId: null
      },
      operationMapping: {
        'START': '启动',
        'STOP': '停止',
        'RESTART': '重启'
      },
      total: 0,
      current: 1,
      store: null,
      refreshingInterval: null,
      throttler: null,
      baseDomain: 'xiyoucloud.pro'
    }
  },
  mounted() {
    this.store = useStore();
    this.baseDomain = this.getBaseDomain();
    this.getInstanceList(this.current, true);
    this.throttler = new Throttle(12, () => {
      this.getInstanceList(this.current, false);
      console.log("获取实例列表-节流器执行");
    }, () => {
      console.log("获取实例列表-节流器节流");
    });
    this.refreshingInterval = setInterval(() => {
      this.throttler.tryExec(this.hasTemporaryStatus);
    }, commonSettings.refreshingIntervalMs);
  },
  unmounted() {
    if (this.refreshingInterval) {
      clearInterval(this.refreshingInterval);
    }
    if (this.clusterResourceDashboardChart) {
      console.log("instanceResourceDashboardChart dispose");
      this.instanceResourceDashboardChart.dispose();
    }
  },

  methods: {
    showStopButton(instance) {
      return instance.instanceStatus === instanceStatus.RUNNING;
    },
    showDeleteButton(instance) {
      return instance.instanceStatus === instanceStatus.STOP || instance.instanceStatus === instanceStatus.ERROR;
    },
    showPasswordButton(instance) {
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
    showExecCommandButton(instance) {
      return instance.instanceStatus === instanceStatus.RUNNING;
    },
    getNodeLabel(item) {
      return `${item.displayName}(CPU使用率 ${item.cpuUsage.toFixed(2)}%，
      内存使用率 ${item.memoryUsage.toFixed(2)}%，系统15分钟平均负载：${item.nodeLoadAvg15}，最低套餐限制：${getPlaningStr(item.lowestPlaning)})`;
    },
    getNodeIsCrowdedStatusTagColor(node) {
      if (node.isCrowded) {
        return 'danger';
      }
      return '';
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
    getDisableStatus(clusterNode) {
      return clusterNode.allowPlannings.indexOf(this.instanceMigrateInfo.planing) === -1;
    },
    getCommandLabel(item) {
      return `${item.command}(${item.commandDescription})`;
    },
    getBadgeType(instance) {
      if (instanceVolumeStatus.ERROR === instance.volumeCheckStatus) {
        return 'danger';
      }
      if (instanceCloudInitStatus.ERROR === instance.cloudInitStatus) {
        return 'danger';
      }
      switch (instance.instanceStatus) {
        case instanceStatus.RUNNING:
          return 'success';
        case instanceStatus.INIT:
          return 'primary';
        case instanceStatus.STOP:
          return 'info';
        case instanceStatus.ERROR:
          return 'danger';
        default:
          return 'info';
      }
    },
    clearExecCommandOutput() {
      this.execCommandData.execCommandStdOutput = '';
      this.execCommandData.execCommandStdError = '';
    },
    handleClickExecCommandButton(instance) {
      this.$httpUtil.get('/linker-server/api/v1/command-template/list', {}).then(res => {
        if (res) {
          this.instanceCommandExecOptions = res.data;
        }
      }, res => {
        console.log(res);
      });
      this.execCommandDialogVisible = true;
      this.execCommandData.instanceId = instance.id;
    },
    getCurrentCommand() {
      const selectCommand = this.instanceCommandExecOptions.find(x => x.id === this.execCommandData.commandTemplateId);
      if (!selectCommand) {
        return '';
      }
      this.execCommandData.command = selectCommand.command;
      return selectCommand.command;
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
    handleExecCommand() {
      if (!this.execCommandData.commandTemplateId) {
        this.$notify.warning({
          title: '错误',
          message: '请选择需要执行的命令'
        });
        return;
      }
      this.execCommandData.loading = true;
      this.$httpUtil.jsonPost('/linker-server/api/v1/instance/exec-command', {
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
    buildLinkHref(instance, item) {
      return `http://${this.getBaseDomain()}:${item.outsidePort}`;
    },
    getBaseDomain() {
      const baseDomain = this.store.getters['baseDomain'];
      switch (baseDomain) {
        case serverDomain.PRIMARY:
          return 'xiyoucloud.pro';
        case serverDomain.BACKUP1:
          return 'ctcc1.xiyoucloud.pro';
        case serverDomain.BACKUP2:
          return 'ctcc2.xiyoucloud.pro';
        case serverDomain.BACKUP3:
          return 'ctcc3.xiyoucloud.pro';
        default:
          return 'xiyoucloud.pro';
      }
    },
    buildLinkDisabledStatus(item) {
      if (item.insidePort === 22) {
        return true;
      }
      return false;
    },
    buildPortTips(item) {
      if (item.insidePort === 22) {
        return "<a href='https://aomoow1hlm.feishu.cn/docx/QW2PdxXeYozrDXxYIdPcd9CsnEe#LksQdIqcao8cIixWkZGced1Mnsf' target='_blank'>SSH连接不上，请看这里</a>";
      } else if (item.insidePort === 8888) {
        return "<a href='https://aomoow1hlm.feishu.cn/docx/SCabdg3WJowr9hxk14wcdK47nlh#Fckvd08Uaobuv2xyDHEc7i5jnPc' target='_blank'>" +
            "Jupyter安装请务必按照我们的教程进行；实例重启后Jupyter打不开？请按照教程手动启动！！！" +
            "</a>";
      } else if (item.insidePort === 8787) {
        return "<a href='https://aomoow1hlm.feishu.cn/docx/QW2PdxXeYozrDXxYIdPcd9CsnEe#Y0MAdzh82oHOI7xC188cuCdYnXd' target='_blank'>点此查看Rstudio安装教程</a>";
      } else if (item.insidePort === 5901) {
        return "<a href='https://xiyoucloud.github.io/2023/01/03/%E5%9C%A8ubuntu20-04LTS%E4%B8%8A%E5%AE%89%E8%A3%85%E5%9B%BE%E5%BD%A2%E5%8C%96%E7%95%8C%E9%9D%A2/' target='_blank'>" +
            "VNC占用带宽过多，我们不建议使用。可以按照教程自行安装，期间出现问题请自行处理，请勿提交工单" +
            "</a>";
      } else {
        return "<a href='https://aomoow1hlm.feishu.cn/docx/QW2PdxXeYozrDXxYIdPcd9CsnEe#BSUvdzb8UoTccpxWfJxc5GE7n8e' target='_blank'>预留的端口映射地址，可以自行分配。端口映射分配科普点击这里</a>";
      }
    },
    buildLinkText(item) {
      return item.portPurpose;
    },
    handleClickDeleteInstanceButton(instance) {
      this.deleteInstanceData.instanceId = instance.id;
      this.deleteInstanceData.instanceName = instance.name;
      this.deleteInstanceData.deleteInstanceDialogVisible = true;
    },
    doDeleteInstance() {
      let deleteInstanceData = this.deleteInstanceData;
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
      this.$httpUtil.jsonPut('/linker-server/api/v1/instance/delete', {
        instanceId: deleteInstanceData.instanceId,
        deleteVolume: this.deleteInstanceData.deleteVolume
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
        this.deleteInstanceData.deleteInstanceDialogVisible = false;
        setTimeout(() => {
          this.refresh();
        }, 1500);
      });
    },
    handleClickPasswordButton(instance) {
      this.instanceAccountInfo.instanceId = instance.id;
      this.passwordDialogVisible = true;
      this.$httpUtil.get('/linker-server/api/v1/instance/get-password', {
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
    handleDoUpdatePassword() {
      let newPwd = this.instancePassword.newPassword;
      let newPwdConfirm = this.instancePassword.newPasswordConfirm;
      if (!newPwd || !newPwdConfirm) {
        this.$notify.error({
          title: '错误',
          message: "密码不能为空"
        });
        return;
      }
      if (newPwd !== newPwdConfirm) {
        this.$notify.error({
          title: '错误',
          message: "两次输入密码不相等"
        });
        return;
      }
      if (newPwd.length < 8) {
        this.$notify.error({
          title: '错误',
          message: "密码长度不能小于8"
        });
        return;
      }
      this.$httpUtil.jsonPut('/linker-server/api/v1/instance/update-password', {
        instanceId: this.instancePassword.instanceId,
        password: newPwd
      }).then(res => {
        if (res.status) {
          this.$notify.notify({
            title: '成功',
            message: '密码修改成功，下次登录实例时生效'
          });
          this.refresh();
        }
      }, res => {
        console.log(res);
      });
      this.passwordDialogVisible = false;
      this.instancePassword.instanceId = null;
      this.instancePassword.password = null;
      this.instancePassword.newPassword = null;
      this.instancePassword.newPasswordConfirm = null;
    },
    getCluster(currentNodeId) {
      this.$httpUtil.get('/linker-server/api/v1/cluster/resource-data', {}).then(res => {
        if (res.status === 0) {
          this.clusters = res.data.nodeResources.filter(c => {
            return c.nodeId !== currentNodeId && c.maintenanceMode !== true && c.memoryUsage && c.cpuUsage
          });
        }
      }, res => {
        console.log(res);
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
    handleMigrateInstance() {
      const loading = this.$loading({
        lock: true,
        text: '操作中，请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$httpUtil.jsonPut('/linker-server/api/v1/instance/migrate', {
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
    handleClickUpdateRemarkButton(instance) {
      this.$prompt('请输入新的备注', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        this.$httpUtil.jsonPut('/linker-server/api/v1/instance/update-remark', {
          instanceId: instance.id,
          userRemark: value
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
    handleClickShowOperationHistoryButton(instance) {
      this.$httpUtil.get('/linker-server/api/v1/operation/get-by-instance-id', {
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
    doUpdateInstanceState() {
      let instance = this.updateInstanceStatusData.instance;
      let state = this.updateInstanceStatusData.targetStatus;
      let force = this.updateInstanceStatusData.force;
      const loading = this.$loading({
        lock: true,
        text: '操作中，请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$httpUtil.jsonPost('/linker-server/api/v1/instance/update-state', {
        instanceId: instance.id,
        state: state,
        force: force
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
    getInstanceList(pageNum, isShowLoading) {
      let loading = null;
      if (isShowLoading) {
        loading = this.$loading({
          lock: true,
          text: '正在查询实例列表，如果长时间加载不出来，一般是实例占用大量内存的时候您重启了实例，导致卡住，这个时候需要联系管理员强制重启，会丢失内存中的数据',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      }
      this.$httpUtil.get('/linker-server/api/v1/instance/list', {
        search: this.search,
        pageNum: pageNum,
        pageSize: 32
      }).then(res => {
        if (res) {
          let response = res.data;
          this.instances = response.data;
          this.total = response.total;
          this.current = response.pageNum;
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        if (loading) {
          loading.close();
        }
      });
    },
    hasTemporaryStatus() {
      for (let idx = 0; idx < this.instances.length; idx++) {
        let item = this.instances[idx];
        let hasTemporaryInstanceStatus = item.instanceStatus === instanceStatus.INIT || item.instanceStatus === instanceStatus.TEMPORARY;
        let hasTemporaryCloudInitStatus = item.instanceStatus === instanceStatus.RUNNING
            && (item.cloudInitStatusStr === instanceCloudInitStatusStr.UNKNOWN || item.cloudInitStatusStr === instanceCloudInitStatusStr.RUNNING);
        if (hasTemporaryInstanceStatus || hasTemporaryCloudInitStatus) {
          return true;
        }
      }
      return false;
    },
    refresh() {
      this.reload();
    },
    handleCurrentChange(pageNum) {
      this.getUserList(pageNum);
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
    getSecurityWarning(instance) {
      if (instance.needTipLoginFailNum) {
        return `该实例近期SSH登录失败次数达到${instance.loginFailNum}次，切勿设置弱密码以免实例被爆破。可到命令执行器查看登录失败的IP与用户名。（检查时间：${instance.loginFailNumCheckTime}）`
      }
      return null;
    },
    isShowRemark(instance) {
      return instance.instanceStatus === instanceStatus.ERROR;
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
      this.instanceResourceDashboardLoading = true;
      this.$httpUtil.get('/linker-server/api/v1/instance/resource-data', {
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
        this.instanceResourceDashboardLoading = false;
      }, res => {
        console.log(res);
      });
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

  .instance-info {
    .card-item();
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

.instance-node-status-tag {
  margin-left: 4px;
}

#instanceResourceDashboard {
  width: 100%;
  min-height: 512px;
  background-color: whitesmoke;
}
</style>
