<template>
  <div id="container">
    <div id="header">
      <el-page-header @back="goBack" title="返回" content="创建项目">
      </el-page-header>
    </div>
    <div id="main">

      <el-form ref="createProjectForm" :model="createProjectForm" label-position="top"
               :rules="createProjectFormRules">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="createProjectForm.name"></el-input>
        </el-form-item>
        <el-form-item label="项目描述" prop="projectIntro">
          <el-input v-model="createProjectForm.intro" type="textarea" rows="2" maxlength="255"></el-input>
        </el-form-item>

        <el-form-item label="SCM用户名" prop="scmConfigUsername">
          <el-input v-model="createProjectForm.scmConfig.username"></el-input>
        </el-form-item>
        <el-form-item label="SCM仓库地址" prop="scmConfigRepositoryUrl">
          <el-input v-model="createProjectForm.scmConfig.repositoryUrl"></el-input>
        </el-form-item>
        <el-form-item label="选择或输入默认分支" prop="scmConfigDefaultBranch">
          <el-select v-model="createProjectForm.scmConfig.defaultBranch"
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
        <el-form-item label="SCM AccessKey" prop="scmConfigAccessToken">
          <el-input v-model="createProjectForm.scmConfig.accessToken" show-password></el-input>
        </el-form-item>


        <el-form-item label="打包镜像" prop="packageImage">
          <el-select v-model="createProjectForm.packageImage" placeholder="请选择或输入打包使用的镜像" filterable
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
          <el-input v-model="createProjectForm.packageScript" type="textarea" rows="5" maxlength="1024"></el-input>
        </el-form-item>

        <el-form-item label="打包输出目录" prop="packageOutputDir">
          <el-input v-model="createProjectForm.packageOutputDir"></el-input>
        </el-form-item>

        <el-form-item label="入口相对路径" prop="packageOutputDir">
          <el-input v-model="createProjectForm.accessPath"></el-input>
        </el-form-item>

        <el-form-item label="权限控制" prop="accessLevel">
          <el-radio-group v-model="createProjectForm.accessLevel">
            <el-radio label="PRIVATE">私有项目</el-radio>
            <el-radio label="PROTECTED">邀请访问</el-radio>
            <el-radio label="PUBLIC">公开访问</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-button type="primary" @click="handleCreateInstance" style="width: 100%">创建</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import {getPlaningStrList} from "@/common/format";

export default {
  name: "InstanceCreateStep",
  inject: ['reload'],
  mounted() {
    this.getImageList();
    this.getSpecification();
    this.getCluster();
    let imageId = this.$route.params.imageId;
    if (imageId) {
      this.createInstanceForm.selectImageId = parseInt(imageId);
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
      specifications: [],
      clusters: [],
      createProjectForm: {
        name: null,
        intro: null,
        scmConfig: {
          scmType: 'GITLAB',
          username: null,
          repositoryUrl: null,
          defaultBranch: 'master',
          accessToken: null
        },
        proxyConfig: {},
        packageImage: null,
        packageScript: null,
        packageOutputDir: 'dist',
        accessPath: "/",
        accessLevel: 'PUBLIC'
      },
      createProjectFormRules: {
        selectImageId: [
          {required: true, message: '请选择镜像', trigger: 'blur'}
        ],
        selectSpecificationId: [
          {required: true, message: '请选择套餐', trigger: 'blur'}
        ],
        selectNodeId: [
          {required: true, message: '请选择节点', trigger: 'blur'}
        ],
        instanceUsername: [
          {required: true, message: '请输入实例用户名', trigger: 'blur'},
          {
            pattern: "^[a-z][-a-z0-9_]*$",
            message: '用户名不符合规范，必须全部小写字母，可以使用-或_分割',
            trigger: 'blur'
          }
        ],
        instancePassword: [
          {required: true, message: '请输入实例密码', trigger: 'blur'},
          {
            pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.#?!@$%^&*-]).{10,20}$",
            message: '密码强度不符合要求，必须包含至少1位大写字母，1位小写字母，1位数字，1位特殊字符(.#?!@$%^&*-)，长度在10-20之间',
            trigger: 'blur'
          }
        ],
        instancePasswordConfirm: [
          {required: true, message: '请确认实例密码', trigger: 'blur'},
          {
            pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.#?!@$%^&*-]).{10,20}$",
            message: '密码强度不符合要求，必须包含至少1位大写字母，1位小写字母，1位数字，1位特殊字符(.#?!@$%^&*-)，长度在10-20之间',
            trigger: 'blur'
          }
        ],
      }
    }
  },
  methods: {
    handleCreateInstance() {
      if (this.createInstanceForm.instancePassword !== this.createInstanceForm.instancePasswordConfirm) {
        this.$notify.warning({
          title: '两次密码不一致',
          message: '两次输入的密码不一致，请再次确认密码'
        });
        return;
      }
      if (this.createInstanceForm.instanceUsername === "root") {
        this.$notify.warning({
          title: '用户名不能是root',
          message: '用户名不能是root，请修改用户名'
        });
        return;
      }
      this.$refs['createInstanceForm'].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '操作中，请耐心等待（约一分钟）',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          const createInstanceForm = this.createInstanceForm;
          this.$httpUtil.jsonPost('/linker-server/api/v1/instance/create', {
            imageId: createInstanceForm.selectImageId,
            specificationId: createInstanceForm.selectSpecificationId,
            nodeId: createInstanceForm.selectNodeId,
            instanceUsername: createInstanceForm.instanceUsername,
            instancePassword: createInstanceForm.instancePassword,
            savePassword: createInstanceForm.savePassword
          }).then(res => {
            if (res) {
              this.$alert('创建实例时可能需要拉取镜像，导致耗时较长，此操作为异步操作。即将跳转到实例列表页面等待操作完毕', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$router.push({
                    path: '/home/instanceList',
                  })
                }
              });
            }
          }, res => {
            console.log(res);
          }).finally(() => {
            loading.close();
          });
        } else {
          return false;
        }
      });
    },
    goBack() {
      this.$router.back();
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
    getSpecificationLabel(item) {
      if (item.volumeId) {
        return `${item.name}(套餐ID：${item.id}  核心数：${item.cpu}  内存：${item.memory}GB  硬盘总大小${item.disk}GB  系统盘大小：${item.osDisk}GB  数据存储卷ID：${item.volumeId})`;
      }
      return `${item.name}(套餐ID：${item.id}  核心数：${item.cpu}  内存：${item.memory}GB  硬盘总大小：${item.disk}GB  系统盘大小：${item.osDisk}GB)`;
    },
    getNodeLabel(item) {
      return `${item.displayName}(CPU使用率 ${item.cpuUsage.toFixed(2)}%，
      内存使用率 ${item.memoryUsage.toFixed(2)}%，系统15分钟平均负载：${item.nodeLoadAvg15}，可以使用此节点的套餐：${getPlaningStrList(item.allowPlannings)})`;
    },
    getNodeIsCrowdedStatusTagColor(node) {
      if (node.isCrowded) {
        return 'danger';
      }
      return 'primary';
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
      let selectSpecificationId = this.createInstanceForm.selectSpecificationId | 0;
      let selectSpecification = this.specifications.filter(x => x.id === selectSpecificationId)[0];
      if (selectSpecification == null) {
        return true;
      }
      // selectSpecification.planing !== clusterNode.lowestPlaning;
      return clusterNode.allowPlannings.indexOf(selectSpecification.planing) === -1;
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
}
</style>
