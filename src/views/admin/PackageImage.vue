<template>
  <div id="container">
    <el-table :data="tableData" style="width: 100%;height: 100%">
      <el-table-column
          label="ID"
          prop="id">
      </el-table-column>
      <el-table-column
          label="镜像名称"
          prop="name">
      </el-table-column>
      <el-table-column
          label="镜像介绍"
          prop="intro">
      </el-table-column>
      <el-table-column
          label="镜像路径"
          prop="imagePath">
      </el-table-column>
      <el-table-column
          label="创建时间"
          prop="createTime">
      </el-table-column>
      <el-table-column
          label="更新时间"
          prop="updateTime">
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <div id="operation-board">
            <el-button
                size="small"
                type="success"
                @click="handleClickAddButton">新增
            </el-button>
            <span>|</span>
            <el-button
                size="small"
                type="info"
                @click="refresh">刷新
            </el-button>
          </div>
        </template>
        <template #default="scope">
          <el-button size="small" type="danger" @click="handleDeleteSettings(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogFormVisible" title="新增镜像">
      <el-form :model="addPackageImageForm" label-position="top" :rules="addPackageImageFormRules" ref="addPackageImageForm">
        <el-form-item label="说明" label-width="120px">
          <el-tag>如果服务器不能在线拉取镜像，需要登录到Linker所在服务器导入镜像后再在这里录入</el-tag>
        </el-form-item>
        <el-form-item label="镜像名称" label-width="120px" prop="name">
          <el-input v-model="addPackageImageForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="镜像介绍" label-width="120px" prop="intro">
          <el-input v-model="addPackageImageForm.intro" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="镜像路径" label-width="120px" prop="imagePath">
          <el-input v-model="addPackageImageForm.imagePath" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDoAddSetting">确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "PackageImage",
  inject: ['reload'],
  data() {
    return {
      dialogFormVisible: false,
      search: '',
      addPackageImageForm: {
        name: '',
        intro: '',
        imagePath: ''
      },
      addPackageImageFormRules: {
        name: [{required: true, message: '请输入镜像名称', trigger: 'blur'}],
        intro: [{required: true, message: '请输入镜像介绍', trigger: 'blur'}],
        imagePath: [{required: true, message: '请输入镜像路径', trigger: 'blur'}],
      },
      tableData: [],
    }
  },
  mounted() {
    this.getPackageImageList();
  },
  methods: {
    getPackageImageList(pageNum) {
      this.$httpUtil.get('/linker-server/api/v1/package-image/list-package-image', {
        pageNum: pageNum,
      }).then(res => {
        if (res) {
          this.tableData = res.data;
        }
      }, (res) => {
        console.log(res);
      });
    },
    handleClickAddButton() {
      this.dialogFormVisible = true;
    },
    handleDeleteSettings(idx, item) {
      this.$confirm('正在删除条目，是否继续？', '确认是否删除镜像', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$httpUtil.urlEncoderDelete('/linker-server/api/v1/package-image/delete-package-image', {
          packageImageId: item.id
        }).then(res => {
          if (res) {
            this.$notify.success({
              title: '成功',
              message: '镜像删除成功'
            });
            this.refresh();
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
    refresh() {
      this.reload();
    },
    handleDoAddSetting() {
      this.$refs['addPackageImageForm'].validate((valid) => {
        if (valid) {
          this.$httpUtil.jsonPost('/linker-server/api/v1/package-image/add-package-image', {
            name: this.addPackageImageForm.name,
            intro: this.addPackageImageForm.intro,
            imagePath: this.addPackageImageForm.imagePath
          }).then(res => {
            if (res) {
              this.$notify.success({
                title: '成功',
                message: '成功添加镜像'
              });
              this.dialogFormVisible = false;
              this.reload();
            }
          }, (res) => {
            console.log(res);
          });
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style scoped lang="less">
#container {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

#operation-board {
}
</style>
