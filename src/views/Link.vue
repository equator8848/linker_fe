<template>
  <div id="container">
    <div id="current-project-details" v-show="currentProject.id">
      <div>
        <el-descriptions class="margin-top" :column="2" border>
          <template #title>
            <div style="display: flex;align-items: center">
              <span style="margin: 2px">当前项目：{{ currentProjectDetails.name }}</span>
              <el-icon v-clipboard:copy="currentProjectDetails.name" v-clipboard:success="copySuccess"
                       v-clipboard:error="copyFail">
                <CopyDocument/>
              </el-icon>
            </div>
          </template>
          <template #extra>
            <el-button type="danger"
                       size="small"
                       v-show="currentProjectDetails.isOwner"
                       @click="handleClickDeleteProject(currentProjectDetails.id)">删除
            </el-button>
            <el-button type="info"
                       size="small"
                       v-show="currentProjectDetails.isOwner"
                       @click="handleClickUpdateProject()">编辑
            </el-button>
            <el-button type="success"
                       size="small"
                       @click="handleClickCreateInstance()">创建实例
            </el-button>
          </template>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <location/>
                </el-icon>
                项目ID
              </div>
            </template>
            {{ currentProject.id }}
            <el-icon v-clipboard:copy="currentProject.id" v-clipboard:success="copySuccess"
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
            {{ currentProjectDetails.intro }}
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
            {{ currentProjectDetails.createTime }} @ {{ currentProjectDetails.createUserName }}
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
            {{ currentProjectDetails.updateTime }} @ {{ currentProjectDetails.updateUserName }}
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
            {{ currentProjectDetails.packageImage }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <Camera/>
                </el-icon>
                默认项目打包分支
              </div>
            </template>
            <a v-show="currentProjectDetails && currentProjectDetails.scmConfig"
               :href="getScmRepositoryUrl()" target="_blank">
              仓库：{{ getScmRepositoryUrl() }}，
              分支： {{ currentProjectDetails.scmConfig ? currentProjectDetails.scmConfig.defaultBranch : '' }}
            </a>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <Camera/>
                </el-icon>
                打包配置
              </div>
            </template>
            打包输出目录：{{ currentProjectDetails ? currentProjectDetails.packageOutputDir : '' }}，
            二级部署目录：{{ currentProjectDetails ? currentProjectDetails.deployFolder : '' }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <Camera/>
                </el-icon>
                访问入口
              </div>
            </template>
            {{ currentProjectDetails ? currentProjectDetails.accessEntrance : '' }}
          </el-descriptions-item>


          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <EditPen/>
                </el-icon>
                项目打包脚本
              </div>
            </template>
            <span style="white-space: pre-wrap;">
              {{ currentProjectDetails.packageScript }}
            </span>
          </el-descriptions-item>


        </el-descriptions>
      </div>
    </div>

    <el-divider content-position="center">
      <span>实例列表</span>
    </el-divider>

    <div id="instance-list">
      <div style="display: flex">
        <el-checkbox v-model="instanceListOnlyStar" @change="onlyStarInstanceFlagChange(this.currentProject.id)"
                     style="margin-right: 8px">
          只看收藏
        </el-checkbox>
        <el-input
            placeholder="请输入内容后键入回车键进行搜索"
            @keydown.enter="getInstanceList(this.currentProject.id)"
            v-model="instanceListSearch"
            clearable>
        </el-input>
        <el-button type="primary" @click="getInstanceList(this.currentProject.id)" style="margin-left: 2px"
                   :loading="instanceListLoading">刷新
        </el-button>
      </div>

      <el-empty description="空空如也" v-show="instanceList.length===0"></el-empty>
      <div class="instance-details" v-for="instance in instanceList" :key="instance.id">
        <el-descriptions class="margin-top" :column="2" border direction="vertical">
          <template #title>
            <div style="display: flex;align-items: center">
              <span style="margin: 2px">{{ instance.name }}</span>
              <el-icon v-clipboard:copy="instance.name" v-clipboard:success="copySuccess"
                       v-clipboard:error="copyFail">
                <CopyDocument/>
              </el-icon>
            </div>
          </template>
          <template #extra>
            <el-button type="info"
                       size="small"
                       v-show="instance.isOwner || instance.editable"
                       @click="handleClickUpdateInstance(instance)">编辑
            </el-button>
            <el-button type="info"
                       size="small"
                       v-show="instance.isOwner"
                       @click="handleSetPublicEntrance(instance)">开放入口配置
            </el-button>
            <el-button type="primary"
                       size="small"
                       @click="handleClickStarAction(instance)">
              {{ instance.stared ? "取消收藏" : "收藏" }}
            </el-button>
            <el-button type="danger"
                       size="small"
                       v-show="instance.isOwner"
                       @click="handleClickDeleteInstance(instance.id)">删除
            </el-button>
            <el-button type="success"
                       size="small"
                       :loading="getPipelineBuildLoadingStatus(instance)"
                       @click="handleClickBuildInstance(instance)">构建
            </el-button>
          </template>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <location/>
                </el-icon>
                实例ID
              </div>
            </template>
            {{ instance.id }}
            <el-icon v-clipboard:copy="instance.id" v-clipboard:success="copySuccess"
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
                实例说明
              </div>
            </template>
            {{ instance.intro }}
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
            {{ instance.createTime }} @ {{ instance.createUserName }}
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
            {{ instance.updateTime }} @ {{ instance.updateUserName }}
          </el-descriptions-item>


          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <Camera/>
                </el-icon>
                实例打包分支
              </div>
            </template>
            {{ instance.scmBranch }}
          </el-descriptions-item>


          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <Camera/>
                </el-icon>
                流水线模板信息
              </div>
            </template>
            {{ instance.pipelineTemplateIntro }}（{{ instance.pipelineTemplateId }}）
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <Setting/>
                </el-icon>
                构建信息
              </div>
            </template>
            <div style="display: flex;align-items: center">
              <el-tag :type="getBuildTagStatus(instance)">{{ buildInstancePipelineBuildInfo(instance) }}</el-tag>

              <el-tag style="margin-left: 4px">镜像版本：{{ instance.imageVersion }}</el-tag>

              <el-button type="info"
                         size="small"
                         style="margin-left: 4px"
                         v-show="instance.imageArchiveUrl"
                         @click="jumpToNewTab(instance.imageArchiveUrl)">
                下载归档文件
              </el-button>
              <el-button type="success"
                         size="small"
                         style="margin-left: 4px"
                         v-show="instance.imageArchiveUrl"
                         v-clipboard:copy="instance.imageArchiveUrl" v-clipboard:success="copySuccess"
                         v-clipboard:error="copyFail">
                复制归档文件链接
              </el-button>
              <el-button type="primary" size="small" @click="clickGetPipelineLog(instance)" style="margin-left: 4px">
                查看构建日志
              </el-button>
            </div>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <TopRight/>
                </el-icon>
                访问地址
              </div>
            </template>
            <el-button @click="jumpToNewTab(instance.accessUrl)" size="small" type="primary">新窗口打开
              {{ instance.accessUrl }}
            </el-button>
            <el-button v-clipboard:copy="instance.accessUrl" v-clipboard:success="copySuccess"
                     v-clipboard:error="copyFail" size="small" type="success">复制访问地址到粘贴板
            </el-button>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <EditPen/>
                </el-icon>
                实例打包脚本
              </div>
            </template>
            <span style="white-space: pre-wrap;">
              {{ instance.packageScript }}
            </span>
          </el-descriptions-item>

        </el-descriptions>
        <div class="instance-proxy-config">
          <el-table :data="instance.proxyConfig.proxyPassConfigs" style="width: 100%" max-height="250">
            <el-table-column prop="location" label="匹配模式（nginx的location）"/>
            <el-table-column prop="proxyPass" label="API代理（nginx的proxy_pass）"/>
            <el-table-column prop="rewriteConfig" label="重写配置（nginx的rewrite）"/>
          </el-table>
        </div>
      </div>
    </div>

    <el-dialog :title="getInstanceOpsName(this.instanceOpsForm.id)" v-model="instanceOpsDialogVisible" width="80%">
      <el-form ref="instanceOpsForm" :model="instanceOpsForm" label-position="top"
               :rules="instanceOpsFormRules">
        <el-form-item label="实例名称" prop="name">
          <el-input v-model="instanceOpsForm.name" show-word-limit maxlength="250"></el-input>
        </el-form-item>
        <el-form-item label="实例描述" prop="intro">
          <el-input v-model="instanceOpsForm.intro" type="textarea" rows="2" show-word-limit maxlength="250"></el-input>
        </el-form-item>
        <el-form-item prop="scmConfig.defaultBranch">
          <template #label>
            <span>选择或输入默认分支（为空则默认沿用项目配置）
              <el-tag :type="this.branchIsDefaultData?'danger':'success'">{{
                  this.branchIsDefaultData ? "无法获取git分支数据，降级使用默认配置，请稍后重试" : "已从git获取相关分支数据"
                }}</el-tag>
            </span>
          </template>
          <el-select v-model="instanceOpsForm.scmBranch"
                     style="width: 100%"
                     placeholder="选择或输入默认分支，拉取该分支代码进行打包"
                     filterable
                     allow-create>
            <el-option
                v-for="item in branchOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="打包脚本配置" prop="packageScriptOverrideFlag">
          <el-radio-group v-model="instanceOpsForm.packageScriptOverrideFlag">
            <el-radio :label="false">使用项目打包脚本配置</el-radio>
            <el-radio :label="true">覆盖项目打包脚本</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="打包脚本" prop="packageScript" v-show="instanceOpsForm.packageScriptOverrideFlag">
          <template #label>
            <span>输入打包脚本
              <el-button size="small" type="primary" link @click="setPackageScriptTemplate">填充基础模板</el-button>
            </span>
          </template>
          <el-input v-model="instanceOpsForm.packageScript" type="textarea" rows="5" maxlength="1024"></el-input>
        </el-form-item>


        <el-form-item label="打包输出目录配置" prop="packageScriptOverrideFlag">
          <el-radio-group v-model="instanceOpsForm.packageOutputDirOverrideFlag">
            <el-radio :label="false">使用项目打包输出目录配置</el-radio>
            <el-radio :label="true">覆盖项目打包输出目录配置</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="打包输出目录（项目根目录到产物目录的路径）" prop="packageOutputDir"
                      v-show="instanceOpsForm.packageOutputDirOverrideFlag">
          <el-input v-model="instanceOpsForm.packageOutputDir"></el-input>
        </el-form-item>

        <el-form-item label="二级部署目录配置" prop="packageScriptOverrideFlag">
          <el-radio-group v-model="instanceOpsForm.deployFolderOverrideFlag">
            <el-radio :label="false">使用项目二级部署目录配置</el-radio>
            <el-radio :label="true">覆盖项目二级部署目录配置</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="二级部署目录（为空则部署在nginx根目录）" prop="deployFolder"
                      v-show="instanceOpsForm.deployFolderOverrideFlag">
          <el-input v-model="instanceOpsForm.deployFolder"></el-input>
        </el-form-item>

        <el-form-item label="入口相对路径配置" prop="accessEntranceOverrideFlag">
          <el-radio-group v-model="instanceOpsForm.accessEntranceOverrideFlag">
            <el-radio :label="false">使用项目入口相对路径配置</el-radio>
            <el-radio :label="true">覆盖项目入口相对路径配置</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="入口相对路径" prop="accessEntrance" v-show="instanceOpsForm.accessEntranceOverrideFlag">
          <el-input v-model="instanceOpsForm.accessEntrance"></el-input>
        </el-form-item>


        <el-form-item label="权限控制" prop="accessLevel">
          <el-radio-group v-model="instanceOpsForm.accessLevel">
            <el-radio label="PRIVATE">私有访问</el-radio>
            <el-radio label="PROTECTED">邀请访问</el-radio>
            <el-radio label="PUBLIC">公开访问</el-radio>
            <el-radio label="PUBLIC_WRITE">公开编辑<span style="color: red;">（生产打包实例建议勾选）</span></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="打包模板配置（为空则使用项目配置）" prop="pipelineTemplateId">
          <el-select v-model="instanceOpsForm.pipelineTemplateId" placeholder="请选择模板" filterable style="width: 100%">
            <el-option
                v-for="item in projectTemplateList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="代理配置（此处配置从项目中复制出来，可以自行调整；如果不配置，则沿用项目配置）"
                      prop="proxyConfig">
          <el-table :data="instanceOpsForm.proxyConfig.proxyPassConfigs" style="width: 100%" max-height="250">

            <el-table-column prop="location" label="匹配模式（nginx的location）">
              <template #default="scope">
                <el-input label="匹配模式" v-model="scope.row.location" v-show="scope.row.isEditing"></el-input>
                <span v-show="!scope.row.isEditing">{{ scope.row.location }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="proxyPass" label="API代理（nginx的proxy_pass）">
              <template #default="scope">
                <el-input label="API代理" v-model="scope.row.proxyPass" v-show="scope.row.isEditing"></el-input>
                <span v-show="!scope.row.isEditing">{{ scope.row.proxyPass }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="rewriteConfig" label="重写配置（nginx的rewrite）">
              <template #default="scope">
                <el-input label="API代理" v-model="scope.row.rewriteConfig" v-show="scope.row.isEditing"></el-input>
                <span v-show="!scope.row.isEditing">{{ scope.row.rewriteConfig }}</span>
              </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作" width="256px">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="saveProxyConfig(scope.row)">
                  保存
                </el-button>
                <el-button link type="warning" size="small" @click="editProxyConfig(scope.row, scope)">
                  编辑
                </el-button>
                <el-button link type="danger" size="small" @click.prevent="removeProxyPassConfig(scope.$index)">
                  移除
                </el-button>
                <el-button link type="info" size="small" @click.prevent="copyProxyPassConfig(scope.$index)">
                  复制
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div id="proxyPassConfigBoard">
            <el-input label="匹配模式" ref="locationInput" v-model="locationInput"></el-input>
            <el-input label="API代理" ref="proxyPassInput" v-model="proxyPassInput"></el-input>
            <el-input label="重写配置" ref="rewriteConfig" v-model="rewriteConfigInput"></el-input>
            <el-button type="success" style="width: 20%" @click="addProxyPassConfig">新增配置</el-button>
          </div>
        </el-form-item>

        <el-form-item label="是否归档镜像（生产环境打包时勾选是，将导出相关镜像归档以供下载）" prop="imageArchiveFlag">
          <el-radio-group v-model="instanceOpsForm.imageArchiveFlag">
            <el-radio :label="false">否，普通联调</el-radio>
            <el-radio :label="true">是，生产打包</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自定义镜像仓库前缀" prop="imageRepositoryPrefix" v-show="instanceOpsForm.imageArchiveFlag">
          <el-input v-model="instanceOpsForm.imageRepositoryPrefix"></el-input>
        </el-form-item>
        <el-form-item label="自定义镜像名称" prop="imageName" v-show="instanceOpsForm.imageArchiveFlag">
          <el-input v-model="instanceOpsForm.imageName"></el-input>
        </el-form-item>
        <el-form-item label="自定义镜像版本类型" prop="imageVersionType" v-show="instanceOpsForm.imageArchiveFlag">
          <el-radio-group v-model="instanceOpsForm.imageVersionType">
            <el-radio :label="0">自定义</el-radio>
            <el-radio :label="1">版本递增，格式为1.0.0，最大版本为999</el-radio>
            <el-radio :label="2">时间作为版本，格式形如202311302145</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自定义镜像版本" prop="imageVersion" v-show="instanceOpsForm.imageArchiveFlag">
          <el-input v-model="instanceOpsForm.imageVersion"></el-input>
        </el-form-item>

        <el-button type="primary" @click="handleOpsInstance" style="width: 100%">
          {{ getInstanceOpsName(this.instanceOpsForm.id) }}
        </el-button>
      </el-form>
    </el-dialog>


    <el-dialog title="公开入口设置" v-model="publicEntranceOpsDialogueVisible" width="80%">
      <el-form label-position="top">
        <el-form-item label="温馨提示：" label-width="150px">
          <div class="warn-tips">
            设置为公开入口后，用户可以不登录系统即可看到相关的入口配置
          </div>
        </el-form-item>
        <el-form-item label="是否启用公开入口" label-width="150px">
          <el-switch v-model="publicEntranceOpsForm.enabledFlag"/>
        </el-form-item>
        <el-form-item label="入口名称" prop="name">
          <el-input v-model="publicEntranceOpsForm.name" show-word-limit maxlength="250"></el-input>
        </el-form-item>
        <el-form-item label="入口描述，可以填写相关测试账号" prop="intro">
          <el-input v-model="publicEntranceOpsForm.intro" type="textarea" rows="3" show-word-limit
                    maxlength="500"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="warning" @click="doSetPublicEntrance">
          确定
        </el-button>
      </span>
      </template>
    </el-dialog>

    <el-dialog id="pipelineLogDialog" title="流水线构建日志" v-model="pipelineBuildLog.visible" width="80%">
      <div id="logBoard">
        {{ pipelineBuildLog.text }}
      </div>
      <div id="opsBoard">
        <el-button type="info"
                   v-show="this.pipelineBuildLog.imageArchiveUrl"
                   @click="jumpToNewTab(this.pipelineBuildLog.imageArchiveUrl)">
          下载归档文件Jenkins归档文件
        </el-button>
        <el-button type="info" @click="jumpToNewTab(buildInstancePipelineBuildInfoUrl(this.pipelineBuildLog.instance))">
          跳转Jenkins
        </el-button>
        <el-button type="primary" :disabled="!pipelineBuildLog.hasMoreData"
                   @click="doGetPipelineBuildLog(this.pipelineBuildLog.instance)">刷新
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getPlaningStrList, nodeIdMask} from '@/common/format'
import * as echarts from "echarts/core";
import {useStore} from "vuex";
import Throttle from "@/common/throttle";
import {deepCopy} from "@/common/clone";

export default {
  name: "Link",
  inject: ['reload'],
  mounted() {
    this.store = useStore();
    this.getProjectDetails(this.currentProject.id);
    this.getInstanceList(this.currentProject.id);
    this.getProjectBranchList(this.currentProject.id);

    this.throttler = new Throttle(32, () => {
      this.getInstanceList(this.currentProject.id, this.refreshInstanceListFlag);
      console.log("获取实例列表-节流器执行");
    }, () => {
      console.log("获取实例列表-节流器节流，不执行");
    });
    this.refreshInstanceListInterval = setInterval(() => {
      this.throttler.tryExec(this.hasBuildingInstance);
    }, 10000);

    this.getProjectTemplateList();
  },
  computed: {
    currentProject() {
      const currentProjectInStore = this.$storage.getters['currentProject'];
      console.log("currentProject computed", currentProjectInStore)
      if (currentProjectInStore) {
        this.getProjectBranchList(currentProjectInStore.id);
      }
      return currentProjectInStore ? currentProjectInStore : {}
    },
  },
  data() {
    return {
      currentProjectDetails: {},
      instanceOpsDialogVisible: false,

      projectTemplateList: [],

      instanceListSearch: null,
      instanceListOnlyStar: localStorage.getItem("instanceListOnlyStar") === "true",
      instanceListLoading: false,
      instanceList: [],

      refreshInstanceListFlag: false,
      refreshInstanceListInterval: null,

      pipelineBuildLog: {
        instance: null,
        visible: false,
        hasMoreData: false,
        text: ""
      },
      pipelineBuildLogRefreshInterval: null,

      branchIsDefaultData: false,
      branchOptions: [
        {
          name: "master",
          value: "master"
        },
        {
          name: "main",
          value: "main"
        },
        {
          name: "dev",
          value: "dev"
        }
      ],

      publicEntranceOpsDialogueVisible: false,
      publicEntranceOpsForm: {
        instanceId: null,
        enabledFlag: false,
        name: null,
        intro: null
      },

      locationInput: null,
      proxyPassInput: null,
      rewriteConfigInput: null,
      emptyInstanceOpsForm: {
        projectId: null,
        id: null,
        name: null,
        intro: null,
        scmBranch: '',

        packageScriptOverrideFlag: false,
        packageScript: null,


        packageOutputDirOverrideFlag: false,
        packageOutputDir: null,

        deployFolderOverrideFlag: false,
        deployFolder: null,

        accessEntranceOverrideFlag: false,
        accessEntrance: null,

        proxyConfig: {
          proxyPassConfigs: []
        },
        accessLevel: 'PUBLIC',
        imageArchiveFlag: false,
        imageRepositoryPrefix: null,
        imageName: null,
        imageVersionType: 0,
        imageVersion: 'latest'
      },
      instanceOpsForm: {
        projectId: null,
        id: null,
        name: null,
        intro: null,
        scmBranch: '',

        packageScriptOverrideFlag: false,
        packageScript: null,


        packageOutputDirOverrideFlag: false,
        packageOutputDir: null,

        deployFolderOverrideFlag: false,
        deployFolder: null,

        accessEntranceOverrideFlag: false,
        accessEntrance: null,

        proxyConfig: {
          proxyPassConfigs: []
        },
        accessLevel: 'PUBLIC',
        imageArchiveFlag: false,
        imageRepositoryPrefix: null,
        imageName: null,
        imageVersionType: 0,
        imageVersion: 'latest'
      },
      instanceOpsFormRules: {
        "name": [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        "intro": [
          {required: true, message: '请输入介绍', trigger: 'blur'}
        ],
        "accessLevel": [
          {required: true, message: '请选择权限控制等级', trigger: 'blur'}
        ],
      }
    }
  },
  watch: {
    currentProject(newVal, oldVal) {
      this.getProjectDetails(newVal.id);
      this.getInstanceList(newVal.id);

    }
  },
  methods: {
    jumpToNewTab(url) {
      window.open(url, '_blank');
    },
    handleClickCreateInstance() {
      this.instanceOpsDialogVisible = true;
      this.instanceOpsForm = {}
      deepCopy(this.instanceOpsForm, this.emptyInstanceOpsForm);
      if (this.currentProjectDetails) {
        this.instanceOpsForm.proxyConfig = this.currentProjectDetails.proxyConfig;
      }
    },
    handleClickUpdateProject() {
      this.$router.push({
        path: `/home/projectOps/${this.currentProject.id}`,
      })
    },
    updateProjectList() {
      this.$httpUtil.get('/linker-server/api/v1/project/list', {}).then(res => {
        if (res) {
          const newProjectList = res.data;
          this.$store.commit("setProjectList", newProjectList);
          if (newProjectList && newProjectList.length !== 0) {
            console.log("setCurrentProject", newProjectList[0])
            this.$store.commit("setCurrentProject", newProjectList[0]);
          } else {
            console.log("setCurrentProject {}")
            this.$store.commit("setCurrentProject", {});
          }
        }
      }, (res) => {
        console.log(res);
      });
    },
    handleClickDeleteProject(projectId) {
      this.$confirm('正在删除项目，是否继续？', '确认是否删除项目', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$httpUtil.urlEncoderDelete('/linker-server/api/v1/project/delete', {
          projectId
        }).then(res => {
          if (res) {
            this.$notify.success({
              title: '成功',
              message: '项目删除成功'
            });
            this.updateProjectList();
          }
        }, res => {
          console.log(res);
        }).finally(() => {
          setTimeout(() => {
            this.reload();
          }, 1000);
        });
      }).catch(() => {
        //
      });
    },
    buildInstancePipelineBuildInfo(instance) {
      if (!instance || !instance.instancePipelineBuildResult) {
        return "";
      }
      const instancePipelineBuildResult = instance.instancePipelineBuildResult;
      return `流水线序号：${instancePipelineBuildResult.id}，提交时间：${instancePipelineBuildResult.submitTimeStr}前，
      耗时：${instancePipelineBuildResult.durationStr}，构建状态：${instancePipelineBuildResult.pipelineResultStr}`;
    },
    getBuildTagStatus(instance) {
      switch (instance.instancePipelineBuildResult.pipelineResultStr) {
        case "成功":
          return "success";
        case "构建中":
          return "";
        case "失败":
          return "danger"
        default:
          return "info";
      }
    },
    buildInstancePipelineBuildInfoUrl(instance) {
      if (!instance || !instance.instancePipelineBuildResult) {
        return "";
      }
      return instance.instancePipelineBuildResult.pipelineUrl;
    },
    getPipelineBuildLoadingStatus(instance) {
      if (instance.instancePipelineBuildResult.canReBuildFlag) {
        return false;
      }
      return instance.buildingFlag;
    },
    handleClickDeleteInstance(instanceId) {
      this.$confirm('正在删除实例，是否继续？', '确认是否删除实例', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$httpUtil.urlEncoderDelete('/linker-server/api/v1/instance/delete', {
          instanceId
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
            this.reload();
          }, 1000);
        });
      }).catch(() => {
        //
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
    getProjectDetails(projectId) {
      if (!projectId) {
        return;
      }
      this.$httpUtil.get('/linker-server/api/v1/project/details', {projectId}).then(res => {
        if (res) {
          this.currentProjectDetails = res.data;
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        //
      });
    },
    hasBuildingInstance() {
      return this.instanceList.find(x => x.buildingFlag);
    },
    onlyStarInstanceFlagChange(projectId) {
      this.getInstanceList(projectId, false);
      localStorage.setItem("instanceListOnlyStar", this.instanceListOnlyStar);
    },
    clickGetPipelineLog(instance) {
      this.doGetPipelineBuildLog(instance);
    },
    doGetPipelineBuildLog(instance) {
      this.$httpUtil.get('/linker-server/api/v1/instance/pipeline-build-log', {
        instanceId: instance.id
      }).then(res => {
        if (res && res.data) {
          const buildLogData = res.data;
          this.pipelineBuildLog.instance = instance;
          this.pipelineBuildLog.text = buildLogData.text;
          this.pipelineBuildLog.hasMoreData = buildLogData.hasMoreData;
          this.pipelineBuildLog.imageArchiveUrl = buildLogData.imageArchiveUrl;
          this.pipelineBuildLog.visible = true;
        } else {
          this.$message({
            message: '获取构建日志失败，请稍后重试',
            duration: 2000
          });
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        //
      });
    },
    getInstanceList(projectId, autoFresh = false) {
      if (!projectId) {
        return;
      }
      this.instanceListLoading = true;
      this.$httpUtil.jsonPost('/linker-server/api/v1/instance/list', {
        projectId,
        searchKeyword: this.instanceListSearch,
        onlyStar: this.instanceListOnlyStar
      }).then(res => {
        if (res) {
          this.instanceList = res.data;
          if (autoFresh) {
            this.$message({
              message: '存在构建中的实例，自动刷新实例列表....',
              duration: 2000
            });
          }

          const firstBuildingInstance = this.instanceList.find(x => x.buildingFlag);
          if (firstBuildingInstance) {
            this.refreshInstanceListFlag = true;
          } else {
            this.refreshInstanceListFlag = false;
            if (this.refreshInstanceListInterval) {
              console.log("清理自动刷新实例列表执行器 >>>");
              clearInterval(this.refreshInstanceListInterval);
            }
          }
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        this.instanceListLoading = false;
      });
    },
    getProjectBranchList(projectId) {
      if (!projectId) {
        return;
      }
      this.$httpUtil.get('/linker-server/api/v1/project/branches-with-tips', {projectId}).then(res => {
        if (res) {
          let branches = res.data.projectBranchInfos;
          this.branchIsDefaultData = res.data.isDefaultData;
          this.branchOptions = branches.map(x => {
            return {
              name: `分支名：${x.name}，commit标题：${x.latestCommitTitle}，commitId：${x.latestCommitId}，时间：${x.latestCommitTime}`,
              value: x.name
            }
          });
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        //
      });
    },
    addProxyPassConfig() {
      if (!this.locationInput) {
        return;
      }
      if (this.proxyPassInput) {
        if (!this.$httpUtil.isValidHttpUrl(this.proxyPassInput)) {
          this.$message({
            showClose: true,
            message: 'API代理不合法，请检查',
            type: 'error'
          });
          return;
        }
      }
      const proxyPassConfig = {
        location: this.locationInput,
        proxyPass: this.proxyPassInput,
        rewriteConfig: this.rewriteConfigInput
      }
      this.instanceOpsForm.proxyConfig.proxyPassConfigs.push(proxyPassConfig);
      this.proxyPassInput = null;
      this.locationInput = null;
      this.rewriteConfigInput = null;
    },
    removeProxyPassConfig(idx) {
      this.instanceOpsForm.proxyConfig.proxyPassConfigs.splice(idx, 1);
    },
    copyProxyPassConfig(idx) {
      const proxyPassConfig = this.instanceOpsForm.proxyConfig.proxyPassConfigs[idx];
      this.locationInput = proxyPassConfig.location;
      this.proxyPassInput = proxyPassConfig.proxyPass;
      this.rewriteConfigInput = proxyPassConfig.rewriteConfig;
    },
    refreshPage() {
      this.reload();
    },
    handleOpsInstance() {
      this.$refs['instanceOpsForm'].validate((valid) => {
        if (valid) {
          const instanceId = this.instanceOpsForm.id;
          if (instanceId) {
            this.doUpdateInstance(instanceId);
          } else {
            this.doCreateInstance();
          }
        } else {
          return false;
        }
      });
    },
    doCreateInstance() {
      this.instanceOpsForm.projectId = this.currentProject.id;
      this.$httpUtil.jsonPost('/linker-server/api/v1/instance/create', this.instanceOpsForm).then(res => {
        if (res) {
          this.$notify({
            title: '成功',
            message: '实例创建成功',
            type: 'success'
          });
          setTimeout(() => {
            this.instanceOpsForm.name = null;
            this.instanceOpsForm.intro = null;
            this.instanceOpsForm.scmBranch = null;
            this.instanceOpsForm.proxyConfig.proxyPassConfigs = [];
            this.instanceOpsForm.accessLevel = 'PUBLIC'
            this.instanceOpsDialogVisible = false;
            this.reload();
          }, 1000)
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        //
      });
    },
    doUpdateInstance(instanceId) {
      this.instanceOpsForm.id = instanceId;
      this.instanceOpsForm.projectId = this.currentProject.id;
      this.$httpUtil.jsonPut('/linker-server/api/v1/instance/update', this.instanceOpsForm).then(res => {
        if (res) {
          this.$notify({
            title: '成功',
            message: '实例更新成功',
            type: 'success'
          });
          setTimeout(() => {
            this.instanceOpsForm.id = null;
            this.instanceOpsForm.name = null;
            this.instanceOpsForm.intro = null;
            this.instanceOpsForm.scmBranch = null;
            this.instanceOpsForm.proxyConfig.proxyPassConfigs = [];
            this.instanceOpsForm.accessLevel = 'PUBLIC'
            this.instanceOpsDialogVisible = false;
            this.refreshPage();
          }, 1000)
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        //
      });
    },
    getInstanceOpsName(instanceId) {
      if (instanceId) {
        return "更新实例"
      }
      return "创建实例"
    },
    handleClickUpdateInstance(instance) {
      this.instanceOpsDialogVisible = true;
      this.instanceOpsForm = instance;
    },
    handleSetPublicEntrance(instance) {
      this.publicEntranceOpsForm.instanceId = instance.id;
      this.getPublicEntranceDetails(instance.id);
    },
    getScmRepositoryUrl() {
      if (!this.currentProjectDetails || !this.currentProjectDetails.scmConfig) {
        return ""
      }
      return this.currentProjectDetails.scmConfig.repositoryUrl;
    },
    getPublicEntranceDetails(instanceId) {
      this.$httpUtil.get('/linker-server/api/v1/instance/public-entrance-details', {instanceId}).then(res => {
        if (res) {
          this.publicEntranceOpsForm = res.data;
          this.publicEntranceOpsDialogueVisible = true;
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        //
      });
    },
    doSetPublicEntrance() {
      this.$httpUtil.jsonPost('/linker-server/api/v1/instance/update-public-entrance',
          {
            instanceId: this.publicEntranceOpsForm.instanceId,
            enabledFlag: this.publicEntranceOpsForm.enabledFlag,
            name: this.publicEntranceOpsForm.name,
            intro: this.publicEntranceOpsForm.intro
          }).then(res => {
        if (res) {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          });
          this.publicEntranceOpsDialogueVisible = false;
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        //
      });
    },
    handleClickStarAction(instance, starAction) {
      this.$httpUtil.jsonPost('/linker-server/api/v1/instance/star',
          {
            projectId: instance.projectId,
            instanceId: instance.id,
            starAction: !instance.stared
          }).then(res => {
        if (res) {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          });
          this.getInstanceList(instance.projectId);
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        //
      });
    },
    handleClickBuildInstance(instance) {
      this.$httpUtil.urlEncoderPut('/linker-server/api/v1/instance/build-pipeline', {
        instanceId: instance.id
      }).then(res => {
        if (res) {
          this.$notify({
            title: '成功',
            message: '成功触发构建',
            type: 'success'
          });
          this.refreshPage();
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        //
      });
    },
    editProxyConfig(row, index) {
      row.isEditing = true;
    },
    saveProxyConfig(row, index) {
      row.isEditing = false;
    },
    setPackageScriptTemplate() {
      this.instanceOpsForm.packageScript = "pnpm --registry https://registry.npmmirror.com install\n" +
          "pnpm run build:pc";
    },
    getProjectTemplateList() {
      this.$httpUtil.get('/linker-server/api/v1/project/templates').then(res => {
        if (res) {
          this.projectTemplateList = res.data.map(x => {
            return {
              name: `${x.intro} （模板ID：${x.templateVersionId}）`,
              value: x.templateVersionId
            }
          });
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        //
      });
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

  #current-project-details {
    .card-item();
    width: 100%;
  }

  #instance-list {
    width: 100%;

    .instance-details {
      .card-item();
      width: 100%;

      .instance-proxy-config {
        .card-item();
      }
    }
  }

  #proxyPassConfigBoard {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-content: space-between;
  }

  .warn-tips {
    color: white;
    background-color: #E6A23C;
    padding: 4px;
    border-radius: 4px;
  }

  #pipelineLogDialog {
    #opsBoard {
      display: flex;
      justify-content: flex-end;
    }

    #logBoard {
      background-color: black;
      color: white;
      padding: 4px;
      border-radius: 4px;
      height: 512px;
      overflow-y: scroll;
      overflow-x: hidden;
      width: 100%;
      white-space: pre-wrap;
    }
  }
}
</style>
