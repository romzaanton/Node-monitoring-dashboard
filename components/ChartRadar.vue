<template>
  <svg
    :id="externalid"
    :class="chartClass"
  />
</template>
<script>
import * as d3 from "d3";
import { getChartSizeByParentDomElement } from "~/utils/charts";

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
    opacityArea: 0.5,
};

function createRadarChart(container, id, cfg) {
    setCfgSizeParams(container, cfg);
    setRadius(cfg);
    setSvgSize(cfg.width, cfg.height, id);  
    const mainSvgGroup = createMainGroup(id);
    addCircularSegments(mainSvgGroup, cfg);
    addInictingText(mainSvgGroup, cfg);
    addDataLines(mainSvgGroup, cfg);
    createPolygons(mainSvgGroup, cfg);
}

function setCfgSizeParams(container, cfg) {
    const size = container.getBoundingClientRect();
    cfg.width = size.width;
    cfg.height = size.height;
}

function setRadius(cfg) {
    cfg.radius = cfg.factor * Math.min(cfg.width/2, cfg.height/2);
}

function setMaximumValue(cfg) {
    cfg.maxValue = Math.max(cfg.maxValue, 
    d3.max(cfg.data, (i) => {
        return d3.max(i.map( o  => o.value));
        })
    );
}

function setSvgSize(width, height, id) {
    d3.select(`#${id}`).attr('width', width).attr('height', height);
}

function createMainGroup(id) {
    let mainSvgGroup = document.querySelector(`#${id}-main-group`);
    if (mainSvgGroup) {
        mainSvgGroup.remove();
    }
    return d3.select(`#${id}`)
        .append('g')
        .attr('id', `#${id}-main-group`);
}

function addCircularSegments(mainSvgGroup, cfg) {
    const axis = cfg.data[0].map(v => v.axis);
    const total = axis.length;
    for(let i = 0; i < cfg.levels - 1; i++) {
        const levelFactor = cfg.factor * cfg.radius * ((i + 1) / cfg.levels);
        mainSvgGroup.selectAll('.levels')
        .data(axis).enter().append('svg:line')
        .attr('x1', (datum, index) => {return levelFactor*(1 - cfg.factor*Math.sin(index*cfg.radians/total));})
        .attr('y1', (datum, index) => {return levelFactor*(1 - cfg.factor*Math.cos(index*cfg.radians/total));})
        .attr('x2', (datum, index) => {return levelFactor*(1 - cfg.factor*Math.sin((index + 1)*cfg.radians/total));})
        .attr('y2', (datum, index) => {return levelFactor*(1 - cfg.factor*Math.cos((index + 1)*cfg.radians/total));})
        .attr('class', 'line')
        .style('stroke', 'grey')
        .style('stroke-opacity', '0.75')
        .style('stroke-width', '0.3px')
        .attr('transform',  `translate(${cfg.width / 2  - levelFactor}, ${cfg.height / 2 - levelFactor})`);
	}
}

function addInictingText(mainSvgGroup, cfg) {
    for(let i = 0;  i < cfg.levels; i++) {
        const levelFactor = cfg.factor * cfg.radius * ((i + 1) / cfg.levels);
        mainSvgGroup.selectAll('.levels')
        .data([1])
        .enter()
        .append('svg:text')
        .attr('x', function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
        .attr('y', function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
        .attr('class', 'legend')
        .style('font-family', 'sans-serif')
        .style('font-size', '10px')
        .attr('transform', `translate(${cfg.width/2-levelFactor + cfg.toRight}, ${cfg.height/2-levelFactor})`)
        .attr('fill', '#737373')
        .text(cfg.legendFormat(((i + 1) * cfg.maxValue / cfg.levels)));
        
	}
}

function addDataLines(mainSvgGroup, cfg) {
    const dataAxis = cfg.data[0].map(v => v.axis);
    const total = dataAxis.length;
    const axis = mainSvgGroup.selectAll('.axis')
    .data(dataAxis)
    .enter()
    .append('g')
    .attr('class', 'axis');

    axis.append('line')
    .attr('x1', cfg.width/2)
    .attr('y1', cfg.height/2)
    .attr('x2', function(d, i){return cfg.width / 2 * ( 1 - cfg.factor * Math.sin(i * cfg.radians/total));})
    .attr('y2', function(d, i){return cfg.height / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians/total));})
    .attr('class', 'line')
    .style('stroke', 'grey')
    .style('stroke-width', '1px');

    axis.append('text')
    .attr('class', 'legend')
    .text(value => value)
    .style('font-family', 'sans-serif')
    .style('font-size', '11px')
    .attr('text-anchor', 'middle')
    .attr('dy', '1.5em')
    .attr('transform', 'translate(0, -10)')
    .attr('x', (d, i) => cfg.width / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians/total))
    .attr('y', (d, i) => cfg.height / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians/total));
}

function createPolygons(mainSvgGroup, cfg) {
    const dataAxis = cfg.data[0].map(v => v.axis);
    const total = dataAxis.length;
    let series = 0;
    cfg.data.forEach((subArray, index) => {
        const dataValues = [];
        mainSvgGroup.selectAll('.nodes')
        .data(subArray, (item, index) => {
            const x = cfg.width / 2 * (1 - (parseFloat(Math.max(item.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(index * cfg.radians/total));
            const y = cfg.height / 2 * (1 - (parseFloat(Math.max(item.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(index * cfg.radians/total));
            dataValues.push([x.toFixed(2), y.toFixed(2)]);
        });
        dataValues.push(dataValues[0]);
        mainSvgGroup.selectAll('.area')
        .data([dataValues])
        .enter()
        .append('polygon')
        .attr('class', 'radar-chart-series-' + series)
        .style('stroke-width', '2px')
        .style('stroke', cfg.color(series))
        .attr('points', (d) => {
            let str = '';
            for(let pti = 0; pti < d.length; pti++) {
                str = str + d[pti][0] + ',' + d[pti][1] + ' ';
            }
            return str;
        })
        .style('fill', (j, i) => cfg.color(series))
        .style('fill-opacity', cfg.opacityArea)
        .on('mouseover', function (d){
            const z = 'polygon.' + d3.select(this)
            .attr('class');
            mainSvgGroup.selectAll('polygon')
            .transition(200)
            .style('fill-opacity', 0.1);
            mainSvgGroup.selectAll(z)
            .transition(200)
            .style('fill-opacity', .7);
        })
        .on('mouseout', function(){
            mainSvgGroup.selectAll('polygon')
            .transition(200)
            .style('fill-opacity', cfg.opacityArea);
        });
        series++;
	});
}

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
