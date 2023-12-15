<template>
  <div id="container">
    <div id="header">
      <el-page-header @back="goBack" title="返回" :content="getOpsName()">
      </el-page-header>
    </div>
    <div id="main">
      <el-form ref="projectOpsForm" :model="projectOpsForm" label-position="top"
               :rules="projectOpsFormRules">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="projectOpsForm.name" show-word-limit maxlength="250"></el-input>
        </el-form-item>
        <el-form-item label="项目描述" prop="intro">
          <el-input v-model="projectOpsForm.intro" type="textarea" rows="2" show-word-limit maxlength="250"></el-input>
        </el-form-item>
        <el-form-item label="SCM类型" prop="scmConfig.scmType">
          <el-radio-group v-model="projectOpsForm.scmConfig.scmType">
            <el-radio label="GITLAB">GITLAB</el-radio>
            <el-radio label="GITHUB" disabled>GITHUB</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="SCM用户名" prop="scmConfig.username">
          <el-input v-model="projectOpsForm.scmConfig.username"></el-input>
        </el-form-item>
        <el-form-item label="SCM仓库地址" prop="scmConfig.repositoryUrl">
          <el-input v-model="projectOpsForm.scmConfig.repositoryUrl"></el-input>
        </el-form-item>
        <el-form-item label="选择或输入默认分支" prop="scmConfig.defaultBranch">
          <el-select v-model="projectOpsForm.scmConfig.defaultBranch"
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
        <el-form-item label="SCM AccessKey" prop="scmConfig.accessToken">
          <el-input v-model="projectOpsForm.scmConfig.accessToken" show-password></el-input>
        </el-form-item>


        <el-form-item label="打包镜像" prop="packageImage">
          <el-select v-model="projectOpsForm.packageImage" placeholder="请选择或输入打包使用的镜像" filterable
                     allow-create>
            <el-option
                v-for="item in packageImageOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="打包脚本" prop="packageScript">
          <el-input v-model="projectOpsForm.packageScript" type="textarea" rows="5" show-word-limit
                    maxlength="1000"></el-input>
        </el-form-item>

        <el-form-item label="打包输出目录（项目根目录到产物目录的路径）" prop="packageOutputDir">
          <el-input v-model="projectOpsForm.packageOutputDir"></el-input>
        </el-form-item>

        <el-form-item label="二级部署目录（为空则部署在nginx根目录）" prop="deployFolder">
          <el-input v-model="projectOpsForm.deployFolder"></el-input>
        </el-form-item>

        <el-form-item label="路由模式（有#的是hash，否则选history）" prop="routeMode">
          <el-radio-group v-model="projectOpsForm.routeMode">
            <el-radio :label="0">hash</el-radio>
            <el-radio :label="1">history</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="入口相对路径" prop="accessEntrance">
          <el-input v-model="projectOpsForm.accessEntrance"></el-input>
        </el-form-item>

        <el-form-item label="权限控制" prop="accessLevel">
          <el-radio-group v-model="projectOpsForm.accessLevel">
            <el-radio label="PRIVATE">私有访问</el-radio>
            <el-radio label="PROTECTED">邀请访问</el-radio>
            <el-radio label="PUBLIC">公开访问</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="模板配置" prop="pipelineTemplateId">
          <el-select v-model="projectOpsForm.pipelineTemplateId" placeholder="请选择模板" filterable>
            <el-option
                v-for="item in projectTemplateList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="代理配置（将指定请求转发到对应的地址）"
                      prop="proxyConfig">
          <el-table :data="projectOpsForm.proxyConfig.proxyPassConfigs" style="width: 100%" max-height="250">

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
                <el-button link type="danger" size="small" @click.prevent="removeProxyPassConfig(scope.$index)">
                  移除
                </el-button>
                <el-button link type="info" size="small" @click.prevent="copyProxyPassConfig(scope.$index)">
                  复制
                </el-button>
                <el-button link type="warning" size="small" @click="editProxyConfig(scope.row, scope)">
                  编辑
                </el-button>
                <el-button link type="primary" size="small" @click="saveProxyConfig(scope.row)">
                  保存
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


        <el-button type="primary" @click="handleOpsProject" style="width: 100%">{{ this.getOpsName() }}</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: "ProjectOps",
  inject: ['reload'],
  mounted() {
    let projectId = this.$route.params.projectId;
    if (projectId) {
      this.projectOpsForm.id = parseInt(projectId);
      this.getProjectDetails(projectId);
    }
    this.getProjectTemplateList();
  },
  data() {
    return {
      packageImageOptions: [
        {
          name: "node 16.13.1 + pnpm 7.5.1",
          value: "lsage/pnpm-circleci-node:16.13.1-pnpm7.5.1"
        }
      ],
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
      projectTemplateList: [],

      locationInput: null,
      proxyPassInput: null,
      rewriteConfigInput: null,
      projectOpsForm: {
        id: null,
        name: null,
        intro: null,
        scmConfig: {
          scmType: 'GITLAB',
          username: null,
          repositoryUrl: null,
          defaultBranch: 'master',
          accessToken: null
        },
        proxyConfig: {
          proxyPassConfigs: []
        },
        packageImage: null,
        pipelineTemplateId: null,
        packageScript: null,
        packageOutputDir: 'dist',
        deployFolder: '',
        routeMode: 0,
        accessEntrance: "/",
        accessLevel: 'PUBLIC'
      },
      projectOpsFormRules: {
        "name": [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        "intro": [
          {required: true, message: '请输入介绍', trigger: 'blur'}
        ],
        "scmConfig.scmType": [
          {required: true, message: '请选择SCM仓库类型', trigger: 'blur'}
        ],
        "scmConfig.username": [
          {required: true, message: '请输入SCM用户名', trigger: 'blur'}
        ],
        "scmConfig.repositoryUrl": [
          {required: true, message: '请输入SCM仓库地址', trigger: 'blur'}
        ],
        "scmConfig.defaultBranch": [
          {required: true, message: '选择或输入SCM默认分支', trigger: 'blur'}
        ],
        "scmConfig.accessToken": [
          {required: true, message: '请输入SCM密钥', trigger: 'blur'}
        ],
        "packageImage": [
          {required: true, message: '请选择或输入打包使用的镜像', trigger: 'blur'}
        ],
        "packageScript": [
          {required: true, message: '请输入打包脚本', trigger: 'blur'}
        ],
        "packageOutputDir": [
          {required: true, message: '请输入打包输出目录', trigger: 'blur'}
        ],
        "accessEntrance": [
          {required: true, message: '请输入访问入口路径', trigger: 'blur'}
        ],
        "accessLevel": [
          {required: true, message: '请选择权限控制等级', trigger: 'blur'}
        ],
        "pipelineTemplateId": [
          {required: true, message: '请选择流水线模板', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    getOpsName() {
      if (this.projectOpsForm.id) {
        return "更新项目"
      } else {
        return "创建项目"
      }
    },
    handleOpsProject() {
      this.$refs['projectOpsForm'].validate((valid) => {
        if (valid) {
          if (this.projectOpsForm.proxyConfig.proxyPassConfigs.length === 0) {
            this.$message({
              showClose: true,
              message: '至少配置一个API代理',
              type: 'error'
            });
            return;
          }
          if (this.projectOpsForm.id) {
            this.doUpdateProject();
          } else {
            this.doCreateProject();
          }
        } else {
          return false;
        }
      });
    },
    getProjectDetails(projectId) {
      this.$httpUtil.get('/linker-server/api/v1/project/details', {projectId}).then(res => {
        if (res) {
          this.projectOpsForm = res.data;
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        //
      });
    },
    doCreateProject() {
      this.$httpUtil.jsonPost('/linker-server/api/v1/project/create', this.projectOpsForm).then(res => {
        if (res) {
          this.$notify({
            title: '成功',
            message: '项目创建成功，即将返回',
            type: 'success'
          });
          this.updateProjectList();
          setTimeout(() => {
            this.$router.push({
              path: '/home/link',
            }, 1500)
          })
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        //
      });
    },
    doUpdateProject() {
      this.$httpUtil.jsonPut('/linker-server/api/v1/project/update', this.projectOpsForm).then(res => {
        if (res) {
          this.$notify({
            title: '成功',
            message: '项目更新成功，即将返回',
            type: 'success'
          });
          this.updateProjectList();
          setTimeout(() => {
            this.$router.push({
              path: '/home/link',
            }, 1500)
          })
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        //
      });
    },
    updateProjectList() {
      this.$httpUtil.get('/linker-server/api/v1/project/list', {}).then(res => {
        if (res) {
          this.$store.commit("setProjectList", res.data.data);
        }
      }, (res) => {
        console.log(res);
      });
    },
    goBack() {
      this.$router.back();
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
      this.projectOpsForm.proxyConfig.proxyPassConfigs.push(proxyPassConfig);
      this.proxyPassInput = null;
      this.locationInput = null;
      this.rewriteConfigInput = null;
    },
    removeProxyPassConfig(idx) {
      this.projectOpsForm.proxyConfig.proxyPassConfigs.splice(idx, 1);
    },
    copyProxyPassConfig(idx) {
      const proxyPassConfig = this.projectOpsForm.proxyConfig.proxyPassConfigs[idx];
      this.locationInput = proxyPassConfig.location;
      this.proxyPassInput = proxyPassConfig.proxyPass;
      this.rewriteConfigInput = proxyPassConfig.rewriteConfig;
    },
    editProxyConfig(row, index) {
      row.isEditing = true;
    },
    saveProxyConfig(row, index) {
      row.isEditing = false;
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

  #header {
    background-color: white;
    height: 50px;
    display: flex;
    align-items: center;
    .card-item();
  }

  #main {
    .card-item();
    display: flex;
    flex-direction: column;

    .el-select {
      width: 100%;
    }

    .el-form-item {
      margin-top: 16px;
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
