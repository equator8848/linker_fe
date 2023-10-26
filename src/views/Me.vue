<template>
  <div id="container">
    <el-card class="box-card">
      <template #header>
        <div class="card-item">
          <span>{{ userInfo.userName }}</span>
          <el-button type="primary" @click="wxNoticeTest">测试微信通知</el-button>
        </div>
      </template>
      <div class="card-item">
        <span>邮箱：{{ updateEmailForm.email }}（是否接收通知：{{ updateEmailForm.emailNoticeSwitch ? "是" : "否" }}）</span>
        <el-button type="success" @click="updateEmailDialogVisible = true">绑定邮箱以及通知开关配置</el-button>
      </div>
    </el-card>

    <el-dialog v-model="updateEmailDialogVisible" title="绑定邮箱">
      <el-form :model="updateEmailForm" label-position="top" :rules="updateEmailFormRules" ref="updateEmailForm">
        <el-form-item label="邮箱地址" label-width="120px" prop="settingKey">
          <el-input v-model="updateEmailForm.email" autocomplete="true"></el-input>
        </el-form-item>
        <el-form-item label="是否接收邮件通知" label-width="150px">
          <el-switch v-model="updateEmailForm.emailNoticeSwitch"/>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="updateEmailDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateEmail">确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {useStore} from "vuex";

export default {
  name: "Me",
  inject: ['reload'],
  data() {
    return {
      store: null,
      userInfo: {},
      email: null,
      updateEmailDialogVisible: false,
      updateEmailForm: {
        email: null,
        emailNoticeSwitch: true
      },
      updateEmailFormRules: {
        email: [{required: true, message: '请输入邮箱', trigger: 'blur'}],
      },
    }
  },
  mounted() {
    this.store = useStore()
    this.userInfo = this.store.getters['userInfo'];
    this.getEmail();
  },
  methods: {
    wxNoticeTest() {
      this.$httpUtil.get('/api/v1/wx/send-template-message-test', {}).then(res => {
        this.$notify.success({
          title: '消息发送成功',
          message: '消息发送成功，请到微信查看'
        });
      }, (res) => {
        console.log(res);
      });
    },
    getEmail() {
      this.$httpUtil.get('/api/v1/user-info/get-notice-config', {}).then(res => {
        if (res) {
          let bindEmail = res.data.email;
          this.updateEmailForm.email = bindEmail ? bindEmail : "";
          this.updateEmailForm.emailNoticeSwitch = res.data.emailNoticeSwitch;
        }
      }, (res) => {
        console.log(res);
      });
    },
    updateEmail() {
      this.$httpUtil.jsonPut('/api/v1/user-info/update-bind-email', {
        email: this.updateEmailForm.email,
        emailNoticeSwitch: this.updateEmailForm.emailNoticeSwitch
      }).then(res => {
        if (res) {
          this.$notify.success({
            title: '成功',
            message: '成功更新邮箱'
          });
          this.updateEmailDialogVisible = false;
          this.reload();
        }
      }, (res) => {
        console.log(res);
      });
    }
  }
}
</script>

<style scoped lang="less">
#container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;

  .card-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .box-card {
    width: 960px;
  }
}

</style>