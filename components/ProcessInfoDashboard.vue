<template>
  <div
    class="app-dashboard-process-chart d-flex flex-xl-row flex-lg-row flex-md-row flex-sm-column flex-column flex-fill"
    :monitroingIsActive="monitroingIsActive"
  >
    <div class="card m-1 p-0 flex-fill">
      <h6 class="card-header">
        {{ 'PID ' + processInMonitoring.pid + ' CPU monitoring.' }}
      </h6>
      <div class="card-body">
        <svg class="app-chart-process-cpu" />
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
function createLineChart(parentElm, data) {
  if (parentElm === null || parentElm === undefined) {
    return;
  }
  d3.select(".app-svg-main-group").remove();
  const domRect = parentElm.getBoundingClientRect();
  const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  };
  const width = domRect.width - margin.left - margin.right;
  const height = 300;

  const svg = d3.select(".app-chart-process-cpu");
  svg.attr("width", width);
  svg.attr("height", height);
  const mainGroup = svg.append("g").attr("class", "app-svg-main-group");
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
    .attr("class", "app-chart-toolptip")
    .style("opacity", 0);

  mainGroup
    .append("g")
    .attr("class", "y-grid")
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
    .select(".y-grid")
    .selectAll("path")
    .remove();
  mainGroup
    .selectAll(".y-grid .tick line")
    .attr("stroke", "#9e9e9e")
    .attr("stroke-width", 0.5);

  mainGroup
    .append("g")
    .attr("class", "x-grid")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(
      d3
        .axisBottom(xLine)
        .ticks(10)
        .tickSize(-height + margin.bottom + margin.top)
        .tickFormat("")
    );

  mainGroup
    .select(".x-grid")
    .selectAll("path")
    .remove();
  mainGroup
    .selectAll(".x-grid .tick line")
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
    .attr("class", "app-chart-x-axis")
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
    .attr("class", "app-chart-y-axis")
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
  computed: {
    processInMonitoring() {
      return this.$store.state.logger.processInMonitoring;
    },
    monitroingIsActive() {
      let perfomanceData = [];
      const processInMonitoring = this.$store.state.logger.processInMonitoring;
      if (
        processInMonitoring &&
        processInMonitoring.processCpuUtilizationArray
      ) {
        perfomanceData = processInMonitoring.processCpuUtilizationArray
        .map((value, index) => {
            return {
                cpuUtilization: value.cpuUtilization,
                timeStamp: index,
            }
        });
        if (this.$parent && this.$parent.$el) {
          createLineChart(
            this.$parent.$el,
            perfomanceData
          );
        }
      }
      return perfomanceData.length > 0 ? true : false;
    }
  },
  mounted() {
    console.log(`Process dahsboard mounted`);
  },
  destroyed() {
    console.log(`Process dahsboard destroyed`);
  }
};
</script>
