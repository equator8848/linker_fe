<template>
  <div id="container">
    <div id="statistical">
    </div>
    <el-table :data="tableData" style="width: 100%;" stripe
              max-height="256">
      <el-table-column
          label="IP地址"
          prop="remoteAddress">
      </el-table-column>
      <el-table-column
          label="时间"
          prop="createTime">
      </el-table-column>
      <el-table-column
          label="用户标识"
          prop="userKey">
      </el-table-column>
      <el-table-column
          label="登录状态"
          prop="loginStatusStr">
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <el-select v-model="days" class="m-2" placeholder="Select" size="small" @change="getList">
            <el-option
                v-for="item in dayOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import {loginStatus, loginType} from "@/common/constant";
import * as echarts from 'echarts/core';
import {GridComponent} from 'echarts/components';
import {BarChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use([GridComponent, BarChart, CanvasRenderer]);

export default {
  name: "LoginLogList",
  inject: ['reload'],
  data() {
    return {
      days: 1,
      dayOptions: [{
        label: '最近1天',
        value: 1
      }, {
        label: '最近3天',
        value: 3
      }, {
        label: '最近7天',
        value: 7
      },],
      tableData: [],
      countMap: new Map(),
      myChart: null
    }
  },
  mounted() {
    this.getList();
    const chartDom = document.getElementById('statistical');
    this.myChart = echarts.init(chartDom);
  },
  methods: {
    getList() {
      this.countMap = new Map();
      this.$httpUtil.get('/linker-server/api/v1/login-log/login-log', {
        days: this.days
      }).then(res => {
        if (res) {
          this.tableData = res.data;
          this.tableData.forEach(d => {
            d.loginStatusStr = this.getLoginStatus(d.loginStatus);
            if (this.countMap.has(d.userKey)) {
              this.countMap.set(d.userKey, this.countMap.get(d.userKey) + 1);
            } else {
              this.countMap.set(d.userKey, 1);
            }
          });
          this.initStatistical();
        }
      }, (res) => {
        console.log(res);
      });
    },
    initStatistical() {
      let arrayObj = Array.from(this.countMap);
      arrayObj.sort(function (a, b) {
        return a[1] - b[1]
      })
      let dataList = [];
      let labelList = [];
      for (let idx in arrayObj) {
        labelList.push(arrayObj[idx][0]);
        dataList.push(arrayObj[idx][1]);
      }
      let option = {
        yAxis: {
          type: 'category',
          data: labelList
        },
        xAxis: {
          type: 'value'
        },
        series: [
          {
            data: dataList,
            type: 'bar'
          }
        ]
      };
      this.myChart.setOption(option);
    },
    getLoginStatus(s) {
      switch (s) {
        case loginStatus.SUCCESS:
          return "登录成功";
        case loginStatus.PASSWORD_NOT_MATCH:
          return "密码不正确";
        case loginStatus.USER_NOT_FOUND:
          return "用户不存在";
        case loginStatus.FORBIDDEN:
          return "禁止登录";
        case loginStatus.NEED_SET_PASSWORD:
          return "密码未设置";
      }
    },
    refresh() {
      this.reload();
    },
  }
}
</script>

<style scoped lang="less">
#container {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  #statistical {
    width: 100%;
    min-height: 512px;
    background-color: whitesmoke;
  }
}
</style>
