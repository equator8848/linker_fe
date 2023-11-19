<template>
  <div id="container">
    <el-table :data="tableData" style="width: 100%;height: 100%">
      <el-table-column
          label="ID"
          prop="id">
      </el-table-column>
      <el-table-column
          label="配置键"
          prop="settingKey">
      </el-table-column>
      <el-table-column
          label="配置值"
          prop="settingValue">
      </el-table-column>
      <el-table-column
          label="备注"
          prop="remark">
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
          <el-button size="small" @click="handleUpdateSettings(scope.$index, scope.row)">修改</el-button>
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

    <el-dialog v-model="dialogFormVisible" title="新增配置">
      <el-form :model="addSettingForm" label-position="top" :rules="addSettingFormRules" ref="addSettingForm">
        <el-form-item label="配置键" label-width="120px" prop="settingKey">
          <el-input v-model="addSettingForm.settingKey" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="配置值" label-width="120px" prop="settingValue">
          <el-input v-model="addSettingForm.settingValue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="120px" prop="remark">
          <el-input v-model="addSettingForm.remark" autocomplete="off"></el-input>
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
  name: "AppSetting",
  inject: ['reload'],
  data() {
    return {
      dialogFormVisible: false,
      search: '',
      addSettingForm: {
        settingKey: '',
        settingValue: '',
        remark: ''
      },
      addSettingFormRules: {
        settingKey: [{required: true, message: '请输入配置键', trigger: 'blur'}],
        settingValue: [{required: true, message: '请输入配置的值', trigger: 'blur'}],
      },
      tableData: [],
      total: 0,
      current: 1,
      pageSize: 0
    }
  },
  mounted() {
    this.getSettingsList(this.current);
  },
  methods: {
    getSettingsList(pageNum) {
      this.$httpUtil.get('/linker-server/api/v1/app-settings/list', {
        pageNum: pageNum,
      }).then(res => {
        if (res) {
          let response = res.data;
          this.tableData = response.data;
          this.total = response.total;
          this.current = response.pageNum;
          this.pageSize = response.size;
        }
      }, (res) => {
        console.log(res);
      });
    },
    handleClickAddButton() {
      this.dialogFormVisible = true;
    },
    handleUpdateSettings(idx, item) {
      this.$prompt('请输入新的值', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        this.$httpUtil.urlEncoderPut('/linker-server/api/v1/app-settings/update', {
          id: item.id,
          settingValue: value
        }).then(res => {
          if (res) {
            this.$notify.success({
              title: '成功',
              message: '成功更新配置'
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
    refresh() {
      this.reload();
    },
    handleCurrentChange(pageNum) {
      this.getSettingsList(pageNum);
    },
    handleDoAddSetting() {
      this.$refs['addSettingForm'].validate((valid) => {
        if (valid) {
          this.$httpUtil.urlEncoderPost('/linker-server/api/v1/app-settings/add', {
            settingKey: this.addSettingForm.settingKey,
            settingValue: this.addSettingForm.settingValue,
            remark: this.addSettingForm.remark
          }).then(res => {
            if (res) {
              this.$notify.success({
                title: '成功',
                message: '成功添加配置'
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
