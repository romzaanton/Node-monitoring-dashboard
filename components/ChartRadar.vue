<template>
  <svg
    :id="externalid"
    :class="chartClass"
  />
</template>
<script>
import * as d3 from 'd3';
import { getChartSizeByParentDomElement } from "~/utils/charts";
import { createRadarChart } from "~/utils/charts-radar-d3";

const data = [
  [
    { axis: "Email", value: 0.59 },
    { axis: "Social Networks", value: 0.56 },
    { axis: "Internet Banking", value: 0.42 },
    { axis: "News Sportsites", value: 0.34 },
    { axis: "Search Engine", value: 0.48 },
    { axis: "View Shopping sites", value: 0.14 },
    { axis: "Paying Online", value: 0.11 },
    { axis: "Buy Online", value: 0.05 },
    { axis: "Stream Music", value: 0.07 },
    { axis: "Online Gaming", value: 0.12 },
    { axis: "Navigation", value: 0.27 },
    { axis: "App connected to TV program", value: 0.03 },
    { axis: "Offline Gaming", value: 0.12 },
    { axis: "Photo Video", value: 0.4 },
    { axis: "Reading", value: 0.03 },
    { axis: "Listen Music", value: 0.22 },
    { axis: "Watch TV", value: 0.03 },
    { axis: "TV Movies Streaming", value: 0.03 },
    { axis: "Listen Radio", value: 0.07 },
    { axis: "Sending Money", value: 0.18 },
    { axis: "Other", value: 0.07 },
    { axis: "Use less Once week", value: 0.08 }
  ],
  [
    { axis: "Email", value: 0.48 },
    { axis: "Social Networks", value: 0.41 },
    { axis: "Internet Banking", value: 0.27 },
    { axis: "News Sportsites", value: 0.28 },
    { axis: "Search Engine", value: 0.46 },
    { axis: "View Shopping sites", value: 0.29 },
    { axis: "Paying Online", value: 0.11 },
    { axis: "Buy Online", value: 0.14 },
    { axis: "Stream Music", value: 0.05 },
    { axis: "Online Gaming", value: 0.19 },
    { axis: "Navigation", value: 0.14 },
    { axis: "App connected to TV program", value: 0.06 },
    { axis: "Offline Gaming", value: 0.24 },
    { axis: "Photo Video", value: 0.17 },
    { axis: "Reading", value: 0.15 },
    { axis: "Listen Music", value: 0.12 },
    { axis: "Watch TV", value: 0.1 },
    { axis: "TV Movies Streaming", value: 0.14 },
    { axis: "Listen Radio", value: 0.06 },
    { axis: "Sending Money", value: 0.16 },
    { axis: "Other", value: 0.07 },
    { axis: "Use less Once week", value: 0.17 }
  ]
];

const cfg = {
    levels: 6,
    factor: 1,
    width: 0, 
    height: 0,
    radius: 0,
    radians: 2 * Math.PI,
    data: [],
    maxValue: 0.6,
    toRight: 5,
    legendFormat: d3.format('.0%'),
    factorLegend: .85,
    color: d3.scaleOrdinal(d3.schemeCategory10),
    opacityArea: 0.35,
    scaleParam: 4,
    opacityCircles: 0.1,
    labelFactor: 1.25,
    margin: {
      top: 50,
      right: 20,
      bottom: 20,
      left: 100,
    },
    wrapWidth: 60,
    strokeWidth: 2,
};

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
    cfg.data = data;
    createRadarChart(this.$parent.$el, this.externalid, cfg);
  }
};
</script>
<style lang="scss" scoped>
</style>
