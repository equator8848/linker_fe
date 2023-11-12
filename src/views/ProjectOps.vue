<template>
  <div id="container">
    <div id="header">
      <el-page-header @back="goBack" title="返回" content="创建项目">
      </el-page-header>
    </div>
    <div id="main">
      <el-form ref="projectOpsForm" :model="projectOpsForm" label-position="top"
               :rules="projectOpsFormRules">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="projectOpsForm.name"></el-input>
        </el-form-item>
        <el-form-item label="项目描述" prop="intro">
          <el-input v-model="projectOpsForm.intro" type="textarea" rows="2" maxlength="255"></el-input>
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
          <el-input v-model="projectOpsForm.packageScript" type="textarea" rows="5" maxlength="1024"></el-input>
        </el-form-item>

        <el-form-item label="打包输出目录" prop="packageOutputDir">
          <el-input v-model="projectOpsForm.packageOutputDir"></el-input>
        </el-form-item>

        <el-form-item label="入口相对路径" prop="accessEntrance">
          <el-input v-model="projectOpsForm.accessEntrance"></el-input>
        </el-form-item>

        <el-form-item label="权限控制" prop="accessLevel">
          <el-radio-group v-model="projectOpsForm.accessLevel">
            <el-radio label="PRIVATE">私有项目</el-radio>
            <el-radio label="PROTECTED">邀请访问</el-radio>
            <el-radio label="PUBLIC">公开访问</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="代理配置" prop="proxyConfig">
          <el-table :data="projectOpsForm.proxyConfig.proxyPassConfigs" style="width: 100%" max-height="250">
            <el-table-column prop="location" label="匹配模式（nginx的location）"/>
            <el-table-column prop="proxyPass" label="API代理（nginx的proxy_pass）"/>
            <el-table-column fixed="right" label="操作" width="120">
              <template #default="scope">
                <el-button
                    link
                    type="primary"
                    size="small"
                    @click.prevent="removeProxyPassConfig(scope.$index)">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div id="proxyPassConfigBoard">
            <el-input label="匹配模式" ref="locationInput" v-model="locationInput"></el-input>
            <el-input label="API代理" ref="proxyPassInput" v-model="proxyPassInput"></el-input>
            <el-button type="success" style="width: 20%" @click="addProxyPassConfig">新增配置</el-button>
          </div>
        </el-form-item>

        <el-button type="primary" @click="handleCreateProject" style="width: 100%">创建项目</el-button>
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
    }
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

      locationInput: null,
      proxyPassInput: null,
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
        packageScript: null,
        packageOutputDir: 'dist',
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
      }
    }
  },
  methods: {
    handleCreateProject() {
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

          this.$httpUtil.jsonPost('/linker-server/api/v1/project/create', this.projectOpsForm).then(res => {
            if (res) {
              this.$notify({
                title: '成功',
                message: '项目创建成功，即将返回首页',
                type: 'success'
              });
              setTimeout(() => {
                this.$router.push({
                  path: '/home/dashboard',
                }, 1500)
              })
            }
          }, res => {
            console.log(res);
          }).finally(() => {
            //
          });
        } else {
          return false;
        }
      });
    },
    goBack() {
      this.$router.back();
    },
    addProxyPassConfig() {
      if (!this.locationInput || !this.proxyPassInput) {
        return;
      }
      const proxyPassConfig = {
        location: this.locationInput,
        proxyPass: this.proxyPassInput
      }
      this.projectOpsForm.proxyConfig.proxyPassConfigs.push(proxyPassConfig);
      this.proxyPassInput = null;
      this.locationInput = null;
    },
    removeProxyPassConfig(idx) {
      this.projectOpsForm.proxyConfig.proxyPassConfigs.splice(idx, 1);
    },
    handleSpecChange(specId) {
      const targetSpec = this.specifications.find(x => x.id === specId);
      if (!targetSpec) {
        return;
      }
      if (targetSpec.volumeLastUsername) {
        this.$confirm('检测到当前套餐关联的数据卷存在历史用户名，建议使用历史用户名；否则除非使用root权限，新用户不能看到家目录旧用户的数据', '提示', {
          confirmButtonText: '使用历史用户名',
          cancelButtonText: '使用新的用户名',
          type: 'warning'
        }).then(() => {
          this.createInstanceForm.instanceUsername = targetSpec.volumeLastUsername;
        }).catch(() => {
          console.log("用户忽略上一次使用的用户");
        });
      }
    },
    getImageLabel(item) {
      return `${item.imageName}(${item.description})`;
    },
    handleImageChange(imageId) {
      const image = this.images.filter(x => x.id === imageId)[0];
      if (image.betaImageFlag) {
        this.$confirm('当前选择的镜像是测试镜像，不建议选择', '警告', {
          confirmButtonText: '切换到正式镜像',
          cancelButtonText: '仍要选择',
          type: 'error'
        }).then(() => {
          const officialImages = this.images.filter(x => !x.betaImageFlag);
          if (!officialImages || officialImages.length === 0) {
            this.$notify.error({
              title: '请联系管理员',
              message: "找不到正式的镜像"
            });
            return;
          }
          console.log("选择正式镜像" + officialImages[0])
          this.createInstanceForm.selectImageId = officialImages[0].id;
        }).catch(() => {
          console.log("用户坚持使用测试版镜像");
        });
      }
    },
    getImageList() {
      this.$httpUtil.get('/linker-server/api/v1/image/list', {}).then(res => {
        if (res) {
          this.images = res.data.data;
          this.handleImageChange(this.createInstanceForm.selectImageId);
        }
      }, res => {
        console.log(res);
      });
    },
    getSpecification() {
      this.$httpUtil.get('/linker-server/api/v1/specification/list', {
        onlyAvailable: true
      }).then(res => {
        if (res) {
          this.specifications = res.data;
        }
      }, res => {
        console.log(res);
      });
    },
    getCluster() {
      this.$httpUtil.get('/linker-server/api/v1/cluster/resource-data', {}).then(res => {
        if (res) {
          this.clusters = res.data.nodeResources.filter(x => x.maintenanceMode !== true && x.memoryUsage && x.cpuUsage);
        }
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
