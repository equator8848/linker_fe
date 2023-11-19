<template>
  <div id="container">
    <div id="header">
      <el-page-header @back="goBack" content="用户信息详情" title="返回"></el-page-header>
    </div>
    <div id="user-info">
      <el-descriptions title="用户信息" border :column="1">
        <template #extra>
          <el-button type="primary" @click="handleClickEditUserInfoButton">编辑用户信息
          </el-button>
          <el-button type="success" @click="changeUserStatus(1)" v-if="showActivateButton()">激活</el-button>
          <el-button type="warning" @click="changeUserStatus(0)" v-else>冻结</el-button>
        </template>
        <el-descriptions-item label="用户ID">{{ userInfo.id }}</el-descriptions-item>
        <el-descriptions-item label="用户名称">{{ userInfo.userName }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ userInfo.status === 1 ? "已激活" : "已冻结" }}</el-descriptions-item>
      </el-descriptions>
    </div>

    <el-dialog v-model="updateUserInfoFormVisible" title="编辑用户信息">
      <el-form :model="updateUserInfoForm" label-position="top" :rules="updateUserInfoFormRules"
               ref="updateUserInfoForm">
        <el-form-item label="用户名" label-width="120px" prop="userName">
          <el-input v-model="updateUserInfoForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码（设置则重置密码）" label-width="120px" prop="userPassword">
          <el-input v-model="updateUserInfoForm.userPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否激活">
          <el-radio-group v-model="updateUserInfoForm.status">
            <el-radio :label="1">激活</el-radio>
            <el-radio :label="0">冻结</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="updateUserInfoFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditUserInfo">确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {userStatus} from "@/common/constant";

export default {
  name: "UserDetails",
  inject: ['reload'],
  mounted() {
    this.uid = this.$route.params.uid;
    this.getUserInfo(this.uid);
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    refresh() {
      this.reload();
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
    showActivateButton() {
      return this.userInfo.status === userStatus.DISABLE;
    },
    handleClickEditUserInfoButton() {
      this.updateUserInfoForm = Object.assign({}, this.userInfo);
      this.updateUserInfoFormVisible = true;
    },
    changeUserStatus(userStatus) {
      this.$httpUtil.urlEncoderPut('/linker-server/api/v1/user/update-status', {
        userId: this.userInfo.id,
        userStatus: userStatus
      }).then(res => {
        if (res.status === 2000) {
          this.$notify.success({
            title: '成功',
            message: '成功修改用户状态信息'
          });
          this.refresh();
        } else {
          this.$notify.error({
            title: '错误',
            message: res.msg + " " + res.data
          });
        }
      });
    },
    handleEditUserInfo() {
      if (!this.updateUserInfoForm.email && !this.updateUserInfoForm.phoneNumber) {
        this.$notify.error({
          title: '错误',
          message: "手机号和邮箱不能同时为空"
        });
        return;
      }
      this.$refs['updateUserInfoForm'].validate((valid) => {
        if (valid) {
          this.$httpUtil.jsonPut('/linker-server/api/v1/user/update', {
            id: this.updateUserInfoForm.id,
            userName: this.updateUserInfoForm.userName,
            userPassword: this.updateUserInfoForm.userPassword,
            phoneNumberPrefix: this.updateUserInfoForm.phoneNumberPrefix,
            phoneNumber: this.updateUserInfoForm.phoneNumber,
            email: this.updateUserInfoForm.email,
            relationId: this.updateUserInfoForm.relationId,
            status: this.updateUserInfoForm.status
          }).then(res => {
            if (res.status === 2000) {
              this.$notify.success({
                title: '成功',
                message: '成功修改用户信息'
              });
              this.updateUserInfoFormVisible = false;
              this.refresh();
            } else {
              this.$notify.error({
                title: '错误',
                message: res.msg + " " + res.data
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    getUserInfo(uid) {
      this.$httpUtil.get('/linker-server/api/v1/user/user-info', {
        uid
      }).then(res => {
        if (res) {
          this.userInfo = res.data;
        }
      }, (res) => {
        console.log(res);
      })
    },
  },
  data() {
    return {
      updateUserInfoFormVisible: false,
      uid: 0,
      userInfo: {
        id: 0,
        userName: '',
        phoneNumberPrefix: null,
        phoneNumber: null,
        email: null,
        status: null,
        userSystemType: null,
        relationId: null
      },


      updateUserInfoForm: null,
      updateUserInfoFormRules: {
        userName: [{required: true, message: '请输入用户名，可以是中文或者英文', trigger: 'blur'}],
        status: [{required: true, message: '请输入用户账号状态', trigger: 'blur'}],
      }
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

  #user-info {
    background-color: white;
    margin-top: 12px;
  }
}
</style>
