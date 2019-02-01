import * as d3 from 'd3';
import { deleteSvgChildren, setSizeParamsToConfig, setSvgSize, setColorInterpolatorToConfig } from './charts';

export function createRadarChart(container, id, config) {
  deleteSvgChildren(id);
  setSizeParamsToConfig(container, config);
  setMaximumValueToConfig(config);
  setAxisParams(config);
  setRadiusToConfig(config);
  setRadiusScaleToConfig(config);
  setRadarLineFuncToConfig(config);
  setColorInterpolatorToConfig(config, d3.schemeCategory10);
  setSvgSize(config, id);
  setMainSvgGroupToConfig(config, id);
  createGlowFilter(config);
  setAxisGridToConfig(config);
  drawBackgroundCircles(config);
  drawAxisLines(config);
  drawTextIndicatorsToAxisGrid(config);
  drawAxisLegend(config);
  createBlobWrapper(config);
  drawOutlines(config);
  drawDataCircles(config);
  drawTooltip(config);
}

function setRadiusToConfig(config) {
  config.radius = Math.min(
    config.width / config.scaleParam,
    config.height / config.scaleParam
  );
}

function setMaximumValueToConfig(config) {
  config.maxValue = d3.max(config.data, i => d3.max(i.map(o => o.value)));
}

function setAxisParams(config) {
  config.axisLabels = config.data[0].map(v => v.axis);
  config.axisCount = config.axisLabels.length;
  config.angleSlice = Math.PI * 2 / config.axisCount;
}

function setRadiusScaleToConfig(config) {
  config.radiusScale = d3
    .scaleLinear()
    .range([0, config.radius])
    .domain([0, config.maxValue]);
}

function setRadarLineFuncToConfig(config) {
  config.radarLine = d3.radialLine();
  config.radarLine.radius(item => config.radiusScale(item.value));
  config.radarLine.angle((item, index) => index * config.angleSlice);
  config.radarLine.curve(d3.curveLinearClosed);

}

function setMainSvgGroupToConfig(config, id) {
  config.mainSvgGroup = d3
    .select(`#${id}`)
    .append('g')
    .attr('id', `#${id}-main-group`)
    .attr('width', config.width / config.scaleParam)
    .attr('height', config.height / config.scaleParam)
    .attr(
      'transform',
      `translate(${config.width / config.scaleParam +
        config.margin.left}, ${config.height / config.scaleParam +
        config.margin.top})`
    );
}

function createGlowFilter(config) {
  const filter = config.mainSvgGroup
    .append('defs')
    .append('filter')
    .attr('id', 'glow');
  const feGaussianBlur = filter
    .append('feGaussianBlur')
    .attr('stdDeviation', '2.5')
    .attr('result', 'coloredBlur');
  const feMerge = filter.append('feMerge');
  const feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur');
  const feMergeNode_2 = feMerge
    .append('feMergeNode')
    .attr('in', 'SourceGraphic');
}

function setAxisGridToConfig(config) {
  config.axisGrid = config.mainSvgGroup
    .append('g')
    .attr('class', 'axisWrapper');
}

function drawBackgroundCircles(config) {
  config.axisGrid
    .selectAll('.levels')
    .data(d3.range(1, config.levels + 1).reverse())
    .enter()
    .append('circle')
    .attr('class', 'gridCircle')
    .attr('r', item => (config.radius / config.levels) * item)
    .style('fill', '#CDCDCD')
    .style('stroke', '#CDCDCD')
    .style('fill-opacity', config.opacityCircles)
    .style('filter', 'url(#glow)');
}

function drawTextIndicatorsToAxisGrid(config) {
  config.axisGrid
    .selectAll('.axisLabels')
    .data(d3.range(1, config.levels + 1).reverse())
    .enter()
    .append('text')
    .attr('class', 'axisLabel')
    .attr('x', 4)
    .attr('y', item => (-item * config.radius) / config.levels)
    .attr('dy', '.4em')
    .style('font-size', '10px')
    .attr('fill', '#737373')
    .text(item => d3.format('.0%')((config.maxValue * item) / config.levels));
}

function drawAxisLines(config) {
  config.axis = config.axisGrid
    .selectAll('.axis')
    .data(config.axisLabels)
    .enter()
    .append('g')
    .attr('class', 'axis');

  config.axis
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr(
      'x2',
      (item, index) =>
        config.radiusScale(config.maxValue * 1.02) *
        Math.cos(config.angleSlice * index - Math.PI / 2)
    )
    .attr(
      'y2',
      (item, index) =>
        config.radiusScale(config.maxValue * 1.02) *
        Math.sin(config.angleSlice * index - Math.PI / 2)
    )
    .attr('class', 'line')
    .style('stroke', 'rgb(205, 205, 205)')
    .style('stroke-width', '2px');
}

function drawAxisLegend(config) {
  config.axis
    .append('text')
    .attr('class', 'legend')
    .style('font-size', '10px')
    .attr('text-anchor', 'middle')
    .attr('dy', '.35em')
    .attr(
      'x',
      (item, index) =>
        config.radiusScale(config.maxValue * config.labelFactor) *
        Math.cos(config.angleSlice * index - Math.PI / 2)
    )
    .attr(
      'y',
      (item, index) =>
        config.radiusScale(config.maxValue * config.labelFactor) *
        Math.sin(config.angleSlice * index - Math.PI / 2)
    )
    .text(item => item)
    .call(wrap, config.wrapWidth);
}

function createBlobWrapper(config) {
  config.blobWrapper = config.mainSvgGroup
    .selectAll('.radarWrapper')
    .data(config.data)
    .enter()
    .append('g')
    .attr('class', 'radarWrapper');

  config.blobWrapper
    .append('path')
    .attr('class', 'radarArea')
    .attr('d', (item, index) => config.radarLine(item))
    .style('fill', (item, index) => config.color(index))
    .style('fill-opacity', config.opacityArea)
    .on('mouseover', function(item, index) {
      d3.selectAll('.radarArea')
        .transition()
        .duration(200)
        .style('fill-opacity', 0.1);
      d3.select(this)
        .transition()
        .duration(200)
        .style('fill-opacity', 0.7);
    })
    .on('mouseout', () => {
      d3.selectAll('.radarArea')
        .transition()
        .duration(200)
        .style('fill-opacity', config.opacityArea);
    });
}

function drawOutlines(config) {
  config.blobWrapper
    .append('path')
    .attr('class', 'radarStroke')
    .attr('d', item => config.radarLine(item))
    .style('stroke-width', `${config.strokeWidth}px`)
    .style('stroke', (item, index) => config.color(index))
    .style('fill', 'none')
    .style('filter', 'url(#glow)');
}

function drawDataCircles(config) {
  config.blobWrapper
    .selectAll('.radarCircle')
    .data((item, index) => item)
    .enter()
    .append('circle')
    .attr('class', 'radarCircle')
    .attr('r', '4px')
    .attr(
      'cx',
      (item, index) =>
        config.radiusScale(item.value) *
        Math.cos(config.angleSlice * index - Math.PI / 2)
    )
    .attr(
      'cy',
      (item, index) =>
        config.radiusScale(item.value) *
        Math.sin(config.angleSlice * index - Math.PI / 2)
    )
    .style('fill', (d, i) => {
      return config.color(i);
    })
    .style('fill-opacity', 0.8);
}

function drawTooltip(config) {
  const tooltip = config.mainSvgGroup
    .append('text')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  const blobCircleWrapper = config.mainSvgGroup
    .selectAll('.radarCircleWrapper')
    .data(config.data)
    .enter()
    .append('g')
    .attr('class', 'radarCircleWrapper');

  blobCircleWrapper
    .selectAll('.radarInvisibleCircle')
    .data(function(item, index) {
      return item;
    })
    .enter()
    .append('circle')
    .attr('class', 'radarInvisibleCircle')
    .attr('r', 4 * 1.5)
    .attr('cx', function(item, index) {
      return (
        config.radiusScale(item.value) *
        Math.cos(config.angleSlice * index - Math.PI / 2)
      );
    })
    .attr('cy', function(item, index) {
      return (
        config.radiusScale(item.value) *
        Math.sin(config.angleSlice * index - Math.PI / 2)
      );
    })
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .on('mouseover', function(item, index) {
      const newX = parseFloat(d3.select(this).attr('cx')) - 10;
      const newY = parseFloat(d3.select(this).attr('cy')) - 10;

      tooltip
        .attr('x', newX)
        .attr('y', newY)
        .text(d3.format('.0%')(item.value))
        .transition()
        .duration(200)
        .style('opacity', 1);
    })
    .on('mouseout', function() {
      tooltip
        .transition()
        .duration(200)
        .style('opacity', 0);
    });
}

function wrap(text, width) {
  text.each(function() {
    let text = d3.select(this),
      words = text
        .text()
        .split(/\s+/)
        .reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.4,
      y = text.attr('y'),
      x = text.attr('x'),
      dy = parseFloat(text.attr('dy')),
      tspan = text
        .text(null)
        .append('tspan')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', dy + 'em');

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text
          .append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', ++lineNumber * lineHeight + dy + 'em')
          .text(word);
      }
    }
  });
}
