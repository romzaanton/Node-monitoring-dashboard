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
        class="card-body"
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
import * as d3 from 'd3';

function createLineChart(data, chartParams) {
  const svgId = chartParams.id;
  const parent = document.querySelector(`#${chartParams.parentId}`);
  if (parent === null || parent === undefined || svgId === undefined) {
    return;
  }
  removeOldElements(svgId);
  const margin = getDefaultMargin();
  const svgSize = chartParams.size;
  const svg = d3.select(`#${svgId}`);
  setSvgElementSizeGroup(svg, svgSize); 
  const mainSvgGroup = getMainSvgGroup(svg, svgId);
  const xLine = getXLine(margin, svgSize);
  const yLine = getYLine(margin, svgSize);
  const xAxis = getXAxis(xLine);
  const yAxis = getYAxis(yLine);
  const line = getLineFunction(xLine, yLine);
  const toolTip = createToolTip(svgId);
  drawYGrid(mainSvgGroup, svgId, yLine, margin, svgSize);
  drawXGrid(mainSvgGroup, svgId, xLine, margin, svgSize);
  drawXAxis(mainSvgGroup, svgId, xAxis, margin, svgSize);
  drawYAxis(mainSvgGroup, svgId, yAxis, margin);
}

function removeOldElements(svgId) {
   d3.select(`#${svgId}-main-group`).remove();
   d3.select(`#${svgId}-chart-toolptip`).remove();
}

function getDefaultMargin() {
  return {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  };
}

function getSizeSvGParams(parent, margin) {
  const domRect = parent.getBoundingClientRect();
  return {
    width: 300,
    height: 200,
  }
}

function setSvgElementSizeGroup(svg, svgSize) {
  svg.attr("width", svgSize.width);
  svg.attr("height", svgSize.height);
}

function getMainSvgGroup(svg, svgId) {
  return svg.append('g').attr('id', `${svgId}-main-group`);;
}

function getXLine(margin, svgSize) {
  return d3
    .scaleLinear()
    .domain([0, 60])
    .range([margin.left + margin.right, svgSize.width - margin.right - margin.left]);
}

function getYLine(margin, svgSize) {
  return d3
    .scaleLinear()
    .domain([0, 100])
    .range([svgSize.height - margin.top, margin.bottom]);
}

function getXAxis(xLine) {
  return d3.axisBottom(xLine).ticks(10);
}

function getYAxis(yLine) {
  return d3.axisLeft(yLine).ticks(10);
}

function getLineFunction(xLine, yLine) {
  return d3.line().x(d => xLine(d.timeStamp))
  .y(d => yLine(d.cpuUtilization))
  .curve(d3.curveLinear);
}

function createToolTip(svgId) {
  return d3.select("body")
  .append("div")
  .attr('id', `${svgId}-chart-toolptip`)
  .style("opacity", 0);
}

function drawYGrid(mainSvgGroup, svgId, yLine, margin, svgSize) {
  mainSvgGroup
  .append("g").attr('id', `${svgId}-y-grid`)
  .call(d3.axisLeft(yLine).ticks(10).tickSize(-(svgSize.width - 80))
  .tickFormat(''))
  .attr(
    "transform",
    `translate(${margin.left + margin.right}, ${margin.bottom - margin.top})` );
}

function drawXGrid(mainSvgGroup, svgId, xLine, margin, svgSize) {
  mainSvgGroup
    .append("g")
    .attr('id', `${svgId}-x-grid`)
    .attr("transform", `translate(0, ${svgSize.height - margin.bottom})`)
    .call(
      d3
        .axisBottom(xLine)
        .ticks(10)
        .tickSize(-svgSize.height + margin.bottom + margin.top)
        .tickFormat("")
    );
  mainSvgGroup
    .select(`#${svgId}-x-grid`)
    .selectAll("path")
    .remove();
  mainSvgGroup
    .selectAll(`#${svgId}-x-grid .tick line`)
    .attr("stroke", "#9e9e9e")
    .attr("stroke-width", 0.5);
}

function drawXAxis(mainSvgGroup, svgId, xAxis, margin, svgSize) {
  mainSvgGroup
    .append("g")
    .attr(`id`, `${svgId}-chart-x-axis`)
    .call(xAxis)
    .attr("transform", `translate(${0}, ${svgSize.height - margin.top})`)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("sec.");
}

function drawYAxis(mainSvgGroup, svgId, yAxis, margin) {
  mainSvgGroup
    .append("g")
    .attr(`id`, `${svgId}-chart-y-axis`)
    .call(yAxis)
    .attr(
      "transform",
      `translate(${margin.left + margin.right}, ${margin.bottom - margin.top})`
    );
}

function canDrawChart() {
  const processInMonitoring = this.$store.state.logger.processInMonitoring;
  return processInMonitoring && processInMonitoring.processCpuUtilizationArray ? true : false;
}

function getPerfomanceData() {
  const processInMonitoring = this.$store.state.logger.processInMonitoring;
  return processInMonitoring.processCpuUtilizationArray.map((value, index) => {
    return {
      cpuUtilization: value.cpuUtilization,
      timeStamp: index,
      }
    });
}

function setChartAreaSize(charts) {
  for (const prop in charts) {
    const id = charts[prop].id;
    const parent = document.querySelector(`#${charts[prop].parentId}`);
    const svg = document.querySelector(`#${id}`);
    if (svg) {
        for (const child of svg.children) {
          child.remove();
        }
        svg.setAttribute('width', 0);
        svg.setAttribute('height', 0);
    }
    if (parent) {
      const size = parent.getBoundingClientRect();
      charts[prop].size.width = size.width;
      charts[prop].size.height = size.height;
    }
  }
}

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

function _createLineChart(parentElm, data, id) {
  if (parentElm === null || parentElm === undefined || id === undefined) {
    return;
  }
  d3.select(`#${id}-main-group`).remove();
  const domRect = parentElm.getBoundingClientRect();
  const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  };
  const width = domRect.width - margin.left - margin.right;
  const height = 300;

  const svg = d3.select(`#${id}`);
  svg.attr("width", width);
  svg.attr("height", height);
  const mainGroup = svg.append('g').attr('id', `${id}-main-group`);
  const xLine = d3
    .scaleLinear()
    .domain([0, 60])
    .range([margin.left + margin.right, width - margin.right - margin.left]);
  const yLine = d3
    .scaleLinear()
    .domain([0, 100])
    .range([height - margin.top, margin.bottom]);
  const xAxis = d3.axisBottom(xLine).ticks(10);
  const yAxis = d3.axisLeft(yLine).ticks(10);
  const line = d3
    .line()
    .x(d => xLine(d.timeStamp))
    .y(d => yLine(d.cpuUtilization))
    .curve(d3.curveLinear);
  const toolTip = d3
    .select("body")
    .append("div")
    .attr('id', `${id}-chart-toolptip`)
    .style("opacity", 0);

  mainGroup
    .append("g")
    .attr('id', `${id}-y-grid`)
    .call(
      d3
        .axisLeft(yLine)
        .ticks(10)
        .tickSize(-(width - 80))
        .tickFormat("")
    )
    .attr(
      "transform",
      `translate(${margin.left + margin.right}, ${margin.bottom - margin.top})`
    );

  mainGroup
    .select(`#${id}-chart-toolptip`)
    .selectAll("path")
    .remove();
  mainGroup
    .selectAll(`#${id}-chart-toolptip .tick line`)
    .attr("stroke", "#9e9e9e")
    .attr("stroke-width", 0.5);

  mainGroup
    .append("g")
    .attr('id', `${id}-x-grid`)
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(
      d3
        .axisBottom(xLine)
        .ticks(10)
        .tickSize(-height + margin.bottom + margin.top)
        .tickFormat("")
    );

  mainGroup
    .select(`#${id}-x-grid`)
    .selectAll("path")
    .remove();
  mainGroup
    .selectAll(`#${id}-x-grid .tick line`)
    .attr("stroke", "#9e9e9e")
    .attr("stroke-width", 0.5);

  mainGroup
    .append("g")
    .attr("class", "line-group")
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "#0277bd")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("filter", "drop-shadow( -5px -5px 5px #000 )")
    .attr("d", () => {
      return line(data);
    });

  mainGroup
    .append("g")
    .attr(`id`, `${id}-chart-x-axis`)
    .call(xAxis)
    .attr("transform", `translate(${0}, ${height - margin.top})`)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("sec.");

  mainGroup
    .append("g")
    .attr(`id`, `${id}-chart-y-axis`)
    .call(yAxis)
    .attr(
      "transform",
      `translate(${margin.left + margin.right}, ${margin.bottom - margin.top})`
    );

  mainGroup
    .selectAll(".chart-dots")
    .append("g")
    .attr("class", "chart-dots")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => {
      return xLine(d.timeStamp);
    })
    .attr("cy", d => {
      return yLine(d.cpuUtilization);
    })
    .attr("r", 2)
    .attr("stroke", "#004c8c")
    .attr("fill", "#58a5f0")
    .on("mouseover", d => {
      toolTip
        .transition()
        .duration(200)
        .style("opacity", 0.8);
      toolTip
        .html(`${d.cpuUtilization}%`)
        .style("left", `${d3.event.pageX}px`)
        .style("top", `${d3.event.pageY - 20}px`);
    })
    .on("mouseout", d => {
      toolTip
        .transition()
        .duration(200)
        .style("opacity", 0);
    });
}
export default {
  name: "AppProcessInfoDahsboard",
  data: () => {
    return {
      charts: Object.assign({}, charts),
    }
  },
  computed: {
    processInMonitoring() {
      if (canDrawChart.call(this)) {
        const perfomanceData = getPerfomanceData.call(this);
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
