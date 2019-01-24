import * as d3 from 'd3';

export function createLineChart(data, chartParams) {
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
  drawLine(mainSvgGroup, svgId, line, data);
  drawDataDots(mainSvgGroup, data, toolTip, xLine, yLine);
}

function removeOldElements(svgId) {
  d3.select(`#${svgId}-main-group`).remove();
  d3.select(`#${svgId}-chart-tooltip`).remove();
}

function getDefaultMargin() {
  return {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  };
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
    .attr('id', `${svgId}-chart-tooltip`)
    .style("opacity", 0);
}

function drawYGrid(mainSvgGroup, svgId, yLine, margin, svgSize) {
  mainSvgGroup
    .append("g").attr('id', `${svgId}-y-grid`)
    .call(d3.axisLeft(yLine).ticks(10).tickSize(-(svgSize.width - 80))
      .tickFormat(''))
    .attr(
      "transform",
      `translate(${margin.left + margin.right}, ${margin.bottom - margin.top})`);

  mainSvgGroup
    .select(`#${svgId}-y-grid`)
    .selectAll("path")
    .remove();

  mainSvgGroup
    .selectAll(`#${svgId}-y-grid .tick line`)
    .attr("stroke", "#9e9e9e")
    .attr("stroke-width", 0.5);
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

function drawLine(mainSvgGroup, svgId, line, data) {
  mainSvgGroup
    .append('g')
    .attr('id', `${svgId}-line-group`)
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', '#0277bd')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', 1.5)
    .attr('filter', 'drop-shadow( -5px -5px 5px #000 )')
    .attr('d', () => {
      return line(data);
    });
}

function drawDataDots(mainSvgGroup, data, toolTip, xLine, yLine) {
  mainSvgGroup.selectAll('.cpu-process-chart-dots').append('g')
    .attr('class', 'cpu-process-chart-dots')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => {
      return xLine(d.timeStamp)
    })
    .attr('cy', (d) => {
      return yLine(d.cpuUtilization)
    })
    .attr('r', 2)
    .attr('stroke', '#004c8c')
    .attr('fill', '#58a5f0')
    .on('mouseover', (d) => {
      toolTip.transition()
        .duration(200)
        .style('opacity', 0.8);
      toolTip.html(`${d.cpuUtilization}%`)
        .style('left', `${(d3.event.pageX)}px`)
        .style('top', `${(d3.event.pageY  - 20)}px`)
    })
    .on('mouseout', (d) => {
      toolTip.transition()
        .duration(200)
        .style('opacity', 0)
    })
}
