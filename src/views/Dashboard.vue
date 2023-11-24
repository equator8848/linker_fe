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
                       v-show="currentProjectDetails.isOwner"
                       @click="handleClickDeleteProject(currentProjectDetails.id)">删除
            </el-button>
            <el-button type="info"
                       v-show="currentProjectDetails.isOwner"
                       @click="handleClickUpdateProject()">编辑
            </el-button>
            <el-button type="success"
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
                创建时间
              </div>
            </template>
            {{ currentProjectDetails.createTime }}
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
            {{ currentProjectDetails.updateTime }}
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
                项目打包分支
              </div>
            </template>
            {{ currentProjectDetails.scmConfig ? currentProjectDetails.scmConfig.defaultBranch : '' }}
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
      <div>
        <el-input
            placeholder="请输入内容后键入回车键进行搜索"
            @keydown.enter="getInstanceList(this.currentProject.id)"
            v-model="instanceListSearch"
            clearable>
        </el-input>
      </div>

      <el-empty description="空空如也" v-show="instanceList.length===0"></el-empty>
      <div class="instance-details" v-for="instance in instanceList" :key="instance.id">
        <el-descriptions class="margin-top" :column="2" border>
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
                       v-show="instance.isOwner"
                       @click="handleClickUpdateInstance(instance)">编辑
            </el-button>
            <el-button type="danger"
                       v-show="instance.isOwner"
                       @click="handleClickDeleteInstance(instance.id)">删除
            </el-button>
            <el-button type="success"
                       @click="handleClickBuildInstance(instance)">触发构建
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
                  <TopRight/>
                </el-icon>
                访问地址
              </div>
            </template>
            <el-button @click="jumpToNewTab(instance.accessUrl)" size="small" type="primary">新窗口打开
              {{ instance.accessUrl }}
            </el-button>
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
            <a target="_blank"
               :href="buildInstancePipelineBuildInfoUrl(instance)">{{ buildInstancePipelineBuildInfo(instance) }}</a>
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
          <el-input v-model="instanceOpsForm.name"></el-input>
        </el-form-item>
        <el-form-item label="实例描述" prop="intro">
          <el-input v-model="instanceOpsForm.intro" type="textarea" rows="2" maxlength="255"></el-input>
        </el-form-item>
        <el-form-item label="选择或输入默认分支（默认沿用项目配置）" prop="scmConfig.defaultBranch">
          <el-select v-model="instanceOpsForm.scmBranch"
                     style="width: 100%"
                     placeholder="选择或输入默认分支，默认拉取该分支代码进行打包"
                     filterable
                     allow-create>
            <el-option
                v-for="item in defaultBranchOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="权限控制" prop="accessLevel">
          <el-radio-group v-model="instanceOpsForm.accessLevel">
            <el-radio label="PRIVATE">私有访问</el-radio>
            <el-radio label="PROTECTED">邀请访问</el-radio>
            <el-radio label="PUBLIC">公开访问</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="代理配置（如果不配置，则沿用项目配置）" prop="proxyConfig">
          <el-table :data="instanceOpsForm.proxyConfig.proxyPassConfigs" style="width: 100%" max-height="250">
            <el-table-column prop="location" label="匹配模式（nginx的location）"/>
            <el-table-column prop="proxyPass" label="API代理（nginx的proxy_pass）"/>
            <el-table-column prop="rewriteConfig" label="重写配置（nginx的rewrite）"/>
            <el-table-column fixed="right" label="操作" width="120">
              <template #default="scope">
                <el-button
                    link
                    type="danger"
                    size="small"
                    @click.prevent="removeProxyPassConfig(scope.$index)">
                  移除
                </el-button>
                <el-button
                    link
                    type="primary"
                    size="small"
                    @click.prevent="copyProxyPassConfig(scope.$index)">
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

        <el-button type="primary" @click="handleOpsInstance" style="width: 100%">
          {{ getInstanceOpsName(this.instanceOpsForm.id) }}
        </el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {getPlaningStrList, nodeIdMask} from '@/common/format'
import * as echarts from "echarts/core";
import {useStore} from "vuex";

export default {
  name: "DashBoard",
  inject: ['reload'],
  mounted() {
    this.store = useStore();
    this.getProjectDetails(this.currentProject.id);
    this.getInstanceList(this.currentProject.id);
  },
  computed: {
    currentProject() {
      const currentProjectInStore = this.$storage.getters['currentProject'];
      return currentProjectInStore ? currentProjectInStore : {}
    },
  },
  data() {
    return {
      currentProjectDetails: {},
      instanceOpsDialogVisible: false,

      instanceListSearch: null,
      instanceList: [],

      defaultBranchOptions: [
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

      locationInput: null,
      proxyPassInput: null,
      rewriteConfigInput: null,
      instanceOpsForm: {
        projectId: null,
        id: null,
        name: null,
        intro: null,
        scmBranch: '',
        proxyConfig: {
          proxyPassConfigs: []
        },
        accessLevel: 'PUBLIC'
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
    },
    handleClickUpdateProject() {
      this.$router.push({
        path: `/home/projectOps/${this.currentProject.id}`,
      })
    },
    updateProjectList() {
      this.$httpUtil.get('/linker-server/api/v1/project/all', {}).then(res => {
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
    buildInstancePipelineBuildInfoUrl(instance) {
      if (!instance || !instance.instancePipelineBuildResult) {
        return "";
      }
      return instance.instancePipelineBuildResult.pipelineUrl;
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
    getInstanceList(projectId) {
      if (!projectId) {
        return;
      }
      this.$httpUtil.jsonPost('/linker-server/api/v1/instance/list', {
        projectId,
        searchKeyword: this.instanceListSearch
      }).then(res => {
        if (res) {
          this.instanceList = res.data;
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
    refresh() {
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
            this.refresh();
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
          this.refresh();
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
}
</style>
