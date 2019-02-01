<template>
  <div>
    <h5>{{ title }}</h5>
    <h6 class="subtitle">
      {{ subtitle }}
    </h6>
    <svg :id="externalid" />
  </div>
</template>
<script>
import { createScatterPlotChart } from "~/utils/charts-scatterplot-d3";
import { scatterPlotData, scatterPlotChartConfig } from '~/tests/d3-mockups';

export default {
  name: 'AppChartScatterplot',
  props: {
    externalid: {
      type: String,
      default: 'error-id',
      required: true
    }
  },
  data: function() {
    return {
      title: 'Life expectancy versus GDP per Capita',
      subtitle: 'Voronoi clipped circles - Final'
    };
  },
  mounted()  {
      const cfg = Object.assign({}, scatterPlotChartConfig);
      cfg.data =  scatterPlotData.slice();
      createScatterPlotChart(this.$parent.$el, this.externalid, cfg);
  },
};
</script>
