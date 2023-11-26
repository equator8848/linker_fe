<template>
  <div id="container">
    <el-table :data="tableData" style="width: 100%;height: 100%">
      <el-table-column
          label="UID"
          prop="id">
      </el-table-column>
      <el-table-column
          label="用户名"
          prop="userName">
      </el-table-column>
      <el-table-column
          label="账号"
          prop="email">
      </el-table-column>
      <el-table-column
          label="用户状态"
          prop="statusStr">
      </el-table-column>
      <el-table-column align="right" width="384px" min-width="256px">
        <template #header>
          <div id="operation-board">
            <el-input
                v-model="search"
                size="small"
                @keyup.enter="handleSearch"
                placeholder="输入关键字搜索"/>
            <el-button
                size="small"
                type="primary"
                @click="handleSearch">搜索
            </el-button>
            <span>|</span>
            <el-button
                size="small"
                type="success"
                @click="handleClickAddUserButton">新增
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
          <el-button size="small" @click="handleGoDetails(scope.$index, scope.row)">详情</el-button>
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

    <el-dialog v-model="dialogFormVisible" title="手动录入用户信息">
      <el-form :model="addUserForm" label-position="top" :rules="addUserFormRules" ref="addUserForm">
        <el-form-item label="用户名" label-width="120px" prop="userName">
          <el-input v-model="addUserForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px" prop="userPassword">
          <el-input v-model="addUserForm.userPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" prop="email">
          <el-input v-model="addUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色类型" label-width="120px" prop="roleType">
          <el-radio-group v-model="addUserForm.roleType">
            <el-radio :label="2">普通用户</el-radio>
            <el-radio :label="4">系统管理员</el-radio>
            <el-radio :label="8">超级管理员</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDoAddUser">确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {userStatus} from '@/common/constant'

export default {
  name: "UserList",
  inject: ['reload'],
  data() {
    return {
      dialogFormVisible: false,
      search: '',
      addUserForm: {
        userName: '',
        userPassword: '',
        phoneNumberPrefix: '86',
        phoneNumber: '',
        email: '',
        roleType: 2
      },
      addUserFormRules: {
        userName: [{required: true, message: '请输入用户名，可以是中文或者英文', trigger: 'blur'}],
        userPassword: [{required: true, message: '请输入用户密码', trigger: 'blur'},
          {
            pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.#?!@$%^&*-]).{10,20}$",
            message: '密码强度不符合要求，必须包含至少1位大写字母，1位小写字母，1位数字，1位特殊字符(.#?!@$%^&*-)，长度在10-20之间',
            trigger: 'blur'
          }],
      },
      tableData: [],
      total: 0,
      current: 1,
      pageSize: 0
    }
  },
  mounted() {
    this.getUserList(this.current);
  },
  methods: {
    getUserList(pageNum) {
      this.$httpUtil.get('/linker-server/api/v1/user/user-list', {
        search: this.search,
        pageNum: pageNum,
      }).then(res => {
        if (res) {
          let response = res.data;
          this.tableData = response.data;
          this.tableData.forEach(d => {
            d.statusStr = d.status === userStatus.NORMAL ? "已激活" : "已冻结"
          })
          this.total = response.total;
          this.current = response.pageNum;
          this.pageSize = response.size;
        }
      }, (res) => {
        console.log(res);
      });
    },
    handleClickAddUserButton() {
      this.dialogFormVisible = true;
    },
    handleSearch() {
      this.getUserList(1);
    },
    handleDisable() {
      //
    },
    handleGoDetails(idx, item) {
      this.$router.push({
        path: `/admin/userDetails/${item.id}`,
      })
    },
    refresh() {
      this.reload();
    },
    handleCurrentChange(pageNum) {
      this.getUserList(pageNum);
    },
    handleDoAddUser() {
      if (!this.addUserForm.email && !this.addUserForm.phoneNumber) {
        this.$notify.error({
          title: '错误',
          message: "手机号和邮箱不能同时为空"
        });
        return;
      }
      this.$refs['addUserForm'].validate((valid) => {
        if (valid) {
          this.$httpUtil.jsonPost('/linker-server/api/v1/user/add', {
            userName: this.addUserForm.userName,
            userPassword: this.addUserForm.userPassword,
            phoneNumberPrefix: this.addUserForm.phoneNumberPrefix,
            phoneNumber: this.addUserForm.phoneNumber,
            email: this.addUserForm.email,
          }).then(res => {
            if (res) {
              this.$notify.success({
                title: '成功',
                message: '成功添加用户信息'
              });
              this.dialogFormVisible = false;
              this.refresh();
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
  display: flex;
  justify-content: space-between;
}
</style>
