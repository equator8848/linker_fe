<template>
  <div id="container">
    <div id="image-info-board">
      <div class="image-info" v-for="item in images" :key="item.id">
        <el-descriptions :title="item.imageName" border :column="2">
          <template #extra>
            <el-button type="primary" size="small" @click="gotoCreateInstance(item.id)">使用</el-button>
          </template>
          <el-descriptions-item label="镜像ID">{{ item.id }}</el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                镜像类型
              </div>
            </template>
            <el-tag class="ml-2" :type="getImageBetaTagColor(item)">
              {{ item.betaImageFlag ? "测试镜像，请勿使用" : "正式" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item width="300px" label="创建时间">{{ item.createTime }}</el-descriptions-item>
          <el-descriptions-item width="300px" label="修改时间">{{ item.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="标签">
            <el-tag size="small" v-for="tag in item.tags" :key="tag">{{ tag }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item width="300px" label="镜像描述">{{ item.description }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <el-pagination
        id="pagination"
        :page-size="pageSize"
        background
        layout="prev, pager, next"
        :current-page="current"
        @current-change="handleCurrentChange"
        :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "ImageMarket",
  data() {
    return {
      images: [],
      total: 0,
      current: 1,
      pageSize: 2,
    }
  },
  mounted() {
    this.getImageList(this.current);
  },
  methods: {
    handleCurrentChange(pageNum) {
      this.getImageList(pageNum);
    },
    getImageList(pageNum) {
      this.$httpUtil.get('/api/v1/image/list', {
        pageNum: pageNum,
      }).then(res => {
        if (res) {
          let responseData = res.data;
          this.images = responseData.data;
          this.total = responseData.total;
          this.current = responseData.pageNum;
          this.pageSize = responseData.size;
        }
      }, (res) => {
        console.log(res);
      });
    },
    getImageBetaTagColor(image) {
      if (image.betaImageFlag) {
        return 'danger';
      }
      return 'success';
    },
    gotoCreateInstance(imageId) {
      this.$router.push({
        path: `/home/instanceCreate/${imageId}`,
      })
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
  justify-content: space-between;

  #image-info-board {
    .image-info {
      .card-item()
    }
  }

  .el-tag {
    margin-left: 4px;
  }

  #pagination {
    background-color: white;
    margin-top: 8px;
  }
}
</style>
