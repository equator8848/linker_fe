<template>
  <div id="container">
    <div id="pie-container">
      <div id="project-clear-status-count">
        项目状态饼图
      </div>
      <div id="instance-clear-status-count">
        项目状态饼图
      </div>
      <div id="user-status-count">
        用户状态饼饼图
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import {PieChart} from 'echarts/charts';
import {LabelLayout} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import {BarChart} from 'echarts/charts';

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer
]);

export default {
  name: "DashboardStatistics",
  data() {
    return {
      instanceClearStatusCountPie: null,
      projectClearStatusCountPie: null,
      userStatusCountPie: null,
    }
  },
  mounted() {
    this.initProjectClearStatusCountPie();
    this.initInstanceClearStatusCountPie();
    this.initUserStatusCountPie();
  },

  unmounted() {
    this.instanceClearStatusCountPie && this.instanceClearStatusCountPie.dispose();
    this.projectClearStatusCountPie && this.projectClearStatusCountPie.dispose();
    this.userStatusCountPie && this.userStatusCountPie.dispose();
  },
  methods: {
    reInitDashBoard() {
      this.instanceClearStatusCountPie && this.instanceClearStatusCountPie.dispose();
      this.projectClearStatusCountPie && this.projectClearStatusCountPie.dispose();
      this.userStatusCountPie && this.userStatusCountPie.dispose();
    },
    getPieOptions(title, dataList) {
      return {
        tooltip: {
          trigger: 'item'
        },
        title: {
          text: title,
          left: 'center'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: title,
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: dataList
          }
        ]
      }
    },
    initInstanceClearStatusCountPie() {
      const chartDom = document.getElementById('instance-clear-status-count');
      this.instanceClearStatusCountPie = echarts.init(chartDom);
      this.$httpUtil.get('/linker-server/api/v1/dashboard/count-instance-del-status', {}).then(res => {
        if (res) {
          const pieData = res.data;
          const option = this.getPieOptions(pieData.title, pieData.dataItems);
          // console.log(option);
          this.instanceClearStatusCountPie.setOption(option);
        }
      }, (res) => {
        console.log(res);
      });
    },
    initProjectClearStatusCountPie() {
      const chartDom = document.getElementById('project-clear-status-count');
      this.projectClearStatusCountPie = echarts.init(chartDom);
      this.$httpUtil.get('/linker-server/api/v1/dashboard/count-project-del-status', {}).then(res => {
        if (res) {
          const pieData = res.data;
          const option = this.getPieOptions(pieData.title, pieData.dataItems);
          // console.log(option);
          this.projectClearStatusCountPie.setOption(option);
        }
      }, (res) => {
        console.log(res);
      });
    },
    initUserStatusCountPie() {
      const chartDom = document.getElementById('user-status-count');
      this.userStatusCountPie = echarts.init(chartDom);
      this.$httpUtil.get('/linker-server/api/v1/dashboard/count-user-status', {}).then(res => {
        if (res) {
          const pieData = res.data;
          const option = this.getPieOptions(pieData.title, pieData.dataItems);
          // console.log(option);
          this.userStatusCountPie.setOption(option);
        }
      }, (res) => {
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

  #pie-container {
    .card-item();
    display: flex;
    justify-content: space-between;

    #instance-clear-status-count, #project-clear-status-count, #user-status-count {
      height: 512px;
      width: 512px;
      background: whitesmoke;
    }
  }
}
</style>