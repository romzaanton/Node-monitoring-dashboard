<template>
  <svg
    :id="externalid"
    :class="chartClass"
  />
</template>
<script>
import { createRadarChart } from "~/utils/charts-radar-d3";
import { radarChartData, radarChartConfig } from '~/tests/d3-mockups';

export default {
  name: 'AppChartRadar',
  props: {
    externalid: {
      type: String,
      default: 'error-id',
      required: true
    }
  },
  data: () => {
    return {
      chartClass: 'app-radar-chart'
    };
  },
  mounted() {
    const cfg = Object.assign({}, radarChartConfig);
    cfg.data = radarChartData;
    createRadarChart(this.$parent.$el, this.externalid, cfg);
  }
};
</script>
<style lang="scss" scoped>
</style>
