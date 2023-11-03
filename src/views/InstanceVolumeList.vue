<template>
  <div id="container">
    <el-empty description="空空如也" v-show="volumes.length===0" class="volume-info">
      <router-link to='/home/imageMarket' style="text-decoration: none;color: gray">
        没有数据存储卷，创建实例时会自动创建，点击此处去创建实例
      </router-link>
    </el-empty>
    <div class="volume-info" v-for="volume in volumes" :key="volume.id">
      <el-descriptions class="margin-top" :title="volume.name" :column="2" border>
        <template #extra>
          <el-button type="danger"
                     v-show="showDeleteButton(volume)"
                     @click="handleDeleteVolume(volume)">删除
          </el-button>
        </template>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Coin/>
              </el-icon>
              存储卷ID
            </div>
          </template>
          {{ volume.id }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Paperclip/>
              </el-icon>
              套餐ID
            </div>
          </template>
          {{ volume.specificationId }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Histogram/>
              </el-icon>
              存储卷大小
            </div>
          </template>
          {{ volume.volumeSize }}GB
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <location/>
              </el-icon>
              挂载点
            </div>
          </template>
          {{ volume.mountPoint }}
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
          {{ volume.createTime }}
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
          {{ volume.updateTime }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Cloudy/>
              </el-icon>
              关联实例ID
            </div>
          </template>
          {{ volume.instanceId }}
        </el-descriptions-item>

      </el-descriptions>
    </div>
  </div>
</template>

<script>
import {commonSettings, instanceStatus} from '@/common/constant'

export default {
  name: "InstanceList",
  inject: ['reload'],
  data() {
    return {
      volumes: [],
      total: 0,
      current: 1,
      store: null,
    }
  },
  mounted() {
    this.getVolumeList(this.current);
  },

  methods: {
    showDeleteButton(volume) {
      return !volume.instanceId;
    },
    handleDeleteVolume(volume) {
      this.$confirm('删除存储卷会删除所有数据，操作不可逆，是否继续？', '高危操作', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doDeleteVolume(volume);
      }).catch(() => {
        //
      });
    },
    doDeleteVolume(volume) {
      const loading = this.$loading({
        lock: true,
        text: '操作中，请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$httpUtil.urlEncoderPut('/linker-server/api/v1/volume/delete', {
        volumeId: volume.id
      }).then(res => {
        if (res) {
          this.$notify.success({
            title: '成功',
            message: '数据卷删除成功'
          });
        }
      }, res => {
        console.log(res);
      }).finally(() => {
        loading.close();
        setTimeout(() => {
          this.reload();
        }, 1500);
      });
    },
    getVolumeList(pageNum) {
      this.$httpUtil.get('/linker-server/api/v1/volume/list', {
        pageNum: pageNum
      }).then(res => {
        if (res) {
          let response = res.data;
          this.volumes = response.data;
          this.total = response.total;
          this.current = response.pageNum;
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

  .volume-info {
    .card-item();
    display: flex;
    flex-direction: column;
  }
}

#operation-board {
  display: flex;
  justify-content: space-between;
}
</style>
