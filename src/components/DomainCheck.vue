<template>
  <div id="container">
    <div id="checkResult">
      <el-result
          :icon="getStatus('primary_domain')"
          title="xiyoucloud.pro"
          sub-title="主线路">
        <template #extra>
          <el-button type="primary" @click="domainCheck('primary_domain')" :loading="primaryDomainLoading">重新检测
          </el-button>
          <el-button :type="getSwitchButtonType('primary_domain')" @click="domainSwitch('primary_domain')"
                     v-show="primaryDomainActivate">切换到此线路
          </el-button>
        </template>
      </el-result>
      <el-result
          :icon="getStatus('backup_domain1')"
          title="ctcc1.xiyoucloud.pro"
          sub-title="文件上传下载，备用线路1">
        <template #extra>
          <el-button type="primary" @click="domainCheck('backup_domain1')" :loading="backUpDomain1Loading">重新检测
          </el-button>
          <el-button :type="getSwitchButtonType('backup_domain1')" @click="domainSwitch('backup_domain1')"
                     v-show="backUpDomain1Activate">切换到此线路
          </el-button>
        </template>
      </el-result>
      <el-result
          :icon="getStatus('backup_domain2')"
          title="ctcc2.xiyoucloud.pro"
          sub-title="文件上传下载，备用线路2">
        <template #extra>
          <el-button type="primary" @click="domainCheck('backup_domain2')" :loading="backUpDomain2Loading">重新检测
          </el-button>
          <el-button :type="getSwitchButtonType('backup_domain2')" @click="domainSwitch('backup_domain2')"
                     v-show="backUpDomain2Activate">切换到此线路
          </el-button>
        </template>
      </el-result>
      <el-result
          :icon="getStatus('backup_domain3')"
          title="ctcc3.xiyoucloud.pro"
          sub-title="文件上传下载，备用线路3">
        <template #extra>
          <el-button type="primary" @click="domainCheck('backup_domain3')" :loading="backUpDomain3Loading">重新检测
          </el-button>
          <el-button :type="getSwitchButtonType('backup_domain3')" @click="domainSwitch('backup_domain3')"
                     v-show="backUpDomain3Activate">切换到此线路
          </el-button>
        </template>
      </el-result>
    </div>
    <div id="connectTips">
      <h3 style="color: red">这里的切换，只是切换此网站的域名，XShell、FinalShell等第三方软件中的域名，需要自行切换！</h3>
    </div>
    <div id="resetTips" style="padding: 8px">
      <el-button size="small" @click="resetNetwork">都无法访问？试试恢复原始设置</el-button>
    </div>
  </div>
</template>

<script>
import {
  serverDomain,
} from '@/common/constant'
import {defineComponent} from 'vue';
import {useStore} from 'vuex'

export default defineComponent({
  name: 'DomainCheck',
  data() {
    return {
      store: null,
      primaryDomainActivate: null,
      primaryDomainLoading: true,
      backUpDomain1Activate: null,
      backUpDomain1Loading: true,
      backUpDomain2Activate: null,
      backUpDomain2Loading: true,
      backUpDomain3Activate: null,
      backUpDomain3Loading: true,
    }
  },
  mounted() {
    this.store = useStore();
    this.domainCheck(serverDomain.PRIMARY);
    this.domainCheck(serverDomain.BACKUP1);
    this.domainCheck(serverDomain.BACKUP2);
    this.domainCheck(serverDomain.BACKUP3);
  },
  methods: {
    getSwitchButtonType(domain) {
      if (!this.store) {
        return 'warning';
      }
      const baseDomain = this.store.getters['baseDomain'];
      if (baseDomain === domain) {
        return 'info';
      }
      return 'warning'
    },
    getDefaultBaseUrl() {
      return process.env.NODE_ENV === 'production' ?
          'https://dayu.xiyoucloud.net/dayu' : 'http://127.0.0.1:8889/dayu'
    },
    resetNetwork() {
      this.store.commit("setBaseUrl", this.getDefaultBaseUrl());
      setTimeout(() => {
        this.$router.push({
          path: '/boarding',
        })
      }, 1000);
    },
    domainCheck(domain) {
      switch (domain) {
        case serverDomain.PRIMARY:
          this.primaryDomainLoading = true;
          break;
        case serverDomain.BACKUP1:
          this.backUpDomain1Loading = true;
          break;
        case serverDomain.BACKUP2:
          this.backUpDomain2Loading = true;
          break;
        case serverDomain.BACKUP3:
          this.backUpDomain3Loading = true;
          break;
      }
      this.$httpUtil.getWithoutBaseUrl(`https://dayu.xiyoucloud.net/${domain}/dayu/linker-server/api/v1/anonymous/ping`, {}).then(res => {
        if (res) {
          switch (domain) {
            case serverDomain.PRIMARY:
              this.primaryDomainActivate = true;
              this.primaryDomainLoading = false;
              break;
            case serverDomain.BACKUP1:
              this.backUpDomain1Activate = true;
              this.backUpDomain1Loading = false;
              break;
            case serverDomain.BACKUP2:
              this.backUpDomain2Activate = true;
              this.backUpDomain2Loading = false;
              break;
            case serverDomain.BACKUP3:
              this.backUpDomain3Activate = true;
              this.backUpDomain3Loading = false;
              break;
          }
        }
      }, res => {
        switch (domain) {
          case serverDomain.PRIMARY:
            this.primaryDomainActivate = false;
            this.primaryDomainLoading = false;
            break;
          case serverDomain.BACKUP1:
            this.backUpDomain1Activate = false;
            this.backUpDomain1Loading = false;
            break;
          case serverDomain.BACKUP2:
            this.backUpDomain2Activate = false;
            this.backUpDomain2Loading = false;
            break;
          case serverDomain.BACKUP3:
            this.backUpDomain3Activate = false;
            this.backUpDomain3Loading = false;
            break;
        }
      }).finally(() => {
        switch (domain) {
          case serverDomain.PRIMARY:
            this.primaryDomainLoading = false;
            break;
          case serverDomain.BACKUP1:
            this.backUpDomain1Loading = false;
            break;
          case serverDomain.BACKUP2:
            this.backUpDomain2Loading = false;
            break;
          case serverDomain.BACKUP3:
            this.backUpDomain3Loading = false;
            break;
        }
      });
    },
    domainSwitch(domain) {
      this.store.commit("setBaseUrl", `https://dayu.xiyoucloud.net/${domain}/dayu`);
      this.store.commit("setBaseDomain", domain);
      setTimeout(() => {
        this.$router.push({
          path: '/boarding',
        })
      }, 1000);
    },
    getIcon(flag) {
      if (flag === true) {
        return 'success'
      } else if (flag === null) {
        return 'warning'
      }
      return 'error'
    },
    getStatus(domain) {
      switch (domain) {
        case serverDomain.PRIMARY:
          return this.getIcon(this.primaryDomainActivate);
        case serverDomain.BACKUP1:
          return this.getIcon(this.backUpDomain1Activate);
        case serverDomain.BACKUP2:
          return this.getIcon(this.backUpDomain2Activate);
        case serverDomain.BACKUP3:
          return this.getIcon(this.backUpDomain3Activate);
      }
    }
  }
});
</script>

<style scoped lang="less">
@import "@/assets/style/common.less";

#container {
  display: flex;
  flex-direction: column;
  align-items: center;

  #checkResult {
    display: flex;
    justify-content: space-around;
  }
}

</style>
