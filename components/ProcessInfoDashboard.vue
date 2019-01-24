<template>
  <div
    class="app-dashboard-process-chart d-flex flex-xl-row flex-lg-row flex-md-row flex-sm-column flex-column flex-fill"
    :activePid="processInMonitoring.pid"
  >
    <div class="card m-1 p-0 flex-fill">
      <h6 class="card-header">
        {{ 'PID ' + processInMonitoring.pid + ' CPU monitoring.' }}
      </h6>
      <div
        :id="charts.cpuChart.parentId"
        class="card-body p-0"
      >
        <svg :id="charts.cpuChart.id" />
      </div>
    </div>
    <div class="card m-1 p-0 flex-fill">
      <h6 class="card-header">
        {{ 'PID ' + processInMonitoring.pid + ' RAM monitoring.' }}
      </h6>
      <div class="card-body">
        <svg />
      </div>
    </div>
  </div>
</template>
<script>
import { createLineChart } from '~/utils/charts-line-d3';
import { canDrawProcessInMonitoringChart } from '~/utils/charts';
import { getPerformanceData, setChartAreaSize } from '~/utils/charts';

const charts = {
  cpuChart: {
    id: 'AppProcessInfoDahsboard-cpu',
    parentId: 'AppProcessInfoDahsboard-cpu-parent',
    size: {
      width: 0,
      height: 0,
      }
    },
    data: [],
};

export default {
  name: "AppProcessInfoDahsboard",
  data: () => {
    return {
      charts: Object.assign({}, charts),
    }
  },
  computed: {
    processInMonitoring() {
      if (canDrawProcessInMonitoringChart.call(this)) {
        const perfomanceData = getPerformanceData.call(this);
        const chartParams = this.charts.cpuChart;
        if (this.$el) createLineChart(perfomanceData, chartParams);
      }
      return this.$store.state.logger.processInMonitoring;
    }
  },
  mounted() {
    setChartAreaSize(this.charts);
    if (window) {
      window.addEventListener('resize', () => {
        setChartAreaSize(this.charts);
      });
    }
  },
  destroyed() {
    console.log(`Process dahsboard destroyed`);
  }
};
</script>
