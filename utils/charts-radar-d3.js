import * as d3 from "d3";

function getDefaultConfiguration(options) {
  const defaultOptions = {
    radius: 5,
    w: 600,
    h: 600,
    factor: 1,
    factorLegend: 0.85,
    levels: 3,
    maxValue: 0,
    radians: 2 * Math.PI,
    opacityArea: 0.5,
    ToRight: 5,
    TranslateX: 80,
    TranslateY: 30,
    ExtraWidthX: 100,
    ExtraWidthY: 100,
    color: d3.scale.category10()
  };
  return Object.assign({}, defaultOptions, options || {});
}

function setMaxValue(cfg, data) {
  const maxValueInData = d3.max(data, item => {
    return item.value;
  });
  cfg.maxValue = Math.max(cfg.maxValue, maxValueInData);
}

function getRadarRadius(cfg) {
  return cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
}

function removeSvgElement(id) {
  d3.select(id)
    .select("svg")
    .remove();
}

function creatMainSvgElement(id, cfg) {
  removeSvgElement(id);
  const mainSvgElement = d3
    .select(id)
    .append("svg")
    .attr("width", cfg.w + cfg.ExtraWidthX)
    .attr("height", cfg.h + cfg.ExtraWidthY)
    .append("g")
    .attr(
      "transform",
      "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")"
    );

  return mainSvgElement;
}

function createCircularSegments(cfg, radius, svg, allAxis) {
  for (let j = 0; j < cfg.levels - 1; j++) {
    const levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
    svg.selectAll(".levels")
      .data(allAxis)
      .enter()
      .append("svg:line")
      .attr("x1", (value, index) => {
        return (
          levelFactor *
          (1 - cfg.factor * Math.sin((index * cfg.radians) / total))
        );
      })
      .attr("y1", function(value, index) {
        return (
          levelFactor *
          (1 - cfg.factor * Math.cos((index * cfg.radians) / total))
        );
      })
      .attr("x2", function(value, index) {
        return (
          levelFactor *
          (1 - cfg.factor * Math.sin(((index + 1) * cfg.radians) / total))
        );
      })
      .attr("y2", function(value, index) {
        return (
          levelFactor *
          (1 - cfg.factor * Math.cos(((index + 1) * cfg.radians) / total))
        );
      })
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-opacity", "0.75")
      .style("stroke-width", "0.3px")
      .attr(
        "transform",
        "translate(" +
          (cfg.w / 2 - levelFactor) +
          ", " +
          (cfg.h / 2 - levelFactor) +
          ")"
      );
  }
}

function addCircularSegmentIndicators(cfg, svg, radius) {
  for (var j = 0; j < cfg.levels; j++) {
    var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
    svg.selectAll(".levels")
      .data([1]) //dummy data
      .enter()
      .append("svg:text")
      .attr("x", function(d) {
        return levelFactor * (1 - cfg.factor * Math.sin(0));
      })
      .attr("y", function(d) {
        return levelFactor * (1 - cfg.factor * Math.cos(0));
      })
      .attr("class", "legend")
      .style("font-family", "sans-serif")
      .style("font-size", "10px")
      .attr(
        "transform",
        "translate(" +
          (cfg.w / 2 - levelFactor + cfg.ToRight) +
          ", " +
          (cfg.h / 2 - levelFactor) +
          ")"
      )
      .attr("fill", "#737373")
      .text(format(((j + 1) * cfg.maxValue) / cfg.levels));
  }
}

function createAxis(cfg, svg, total) {
  const axis = svg
    .selectAll(".axis")
    .data(allAxis)
    .enter()
    .append("g")
    .attr("class", "axis");

  axis
    .append("line")
    .attr("x1", cfg.w / 2)
    .attr("y1", cfg.h / 2)
    .attr("x2", function(d, i) {
      return (
        (cfg.w / 2) * (1 - cfg.factor * Math.sin((i * cfg.radians) / total))
      );
    })
    .attr("y2", function(d, i) {
      return (
        (cfg.h / 2) * (1 - cfg.factor * Math.cos((i * cfg.radians) / total))
      );
    })
    .attr("class", "line")
    .style("stroke", "grey")
    .style("stroke-width", "1px");

  axis
    .append("text")
    .attr("class", "legend")
    .text(function(d) {
      return d;
    })
    .style("font-family", "sans-serif")
    .style("font-size", "11px")
    .attr("text-anchor", "middle")
    .attr("dy", "1.5em")
    .attr("transform", function(d, i) {
      return "translate(0, -10)";
    })
    .attr("x", function(d, i) {
      return (
        (cfg.w / 2) *
          (1 - cfg.factorLegend * Math.sin((i * cfg.radians) / total)) -
        60 * Math.sin((i * cfg.radians) / total)
      );
    })
    .attr("y", function(d, i) {
      return (
        (cfg.h / 2) * (1 - Math.cos((i * cfg.radians) / total)) -
        20 * Math.cos((i * cfg.radians) / total)
      );
    });
}

function createPolygons(cfg, svg, data, total) {
  let series = 0;
  dataValues = [];
  svg.selectAll('.nodes').data(data, (item, index) => {
    dataValues.push([
      (cfg.w / 2) *
      (1 - (parseFloat(Math.max(item.value, 0)) / cfg.maxValue) 
        * cfg.factor * Math.sin((index * cfg.radians) / total)),
        (cfg.h / 2) * (1 -
            (parseFloat(Math.max(item.value, 0)) / cfg.maxValue) *
              cfg.factor *
              Math.cos((index * cfg.radians) / total))
      ]);

    dataValues.push(dataValues[0]);
    g.selectAll(".area")
      .data([dataValues])
      .enter()
      .append("polygon")
      .attr("class", "radar-chart-serie" + series)
      .style("stroke-width", "2px")
      .style("stroke", cfg.color(series))
      .attr("points", function(d) {
        var str = "";
        for (var pti = 0; pti < d.length; pti++) {
          str = str + d[pti][0] + "," + d[pti][1] + " ";
        }
        return str;
      })
      .style("fill", function(j, i) {
        return cfg.color(series);
      })
      .style("fill-opacity", cfg.opacityArea)
      .on("mouseover", function(d) {
        z = "polygon." + d3.select(this).attr("class");
        g.selectAll("polygon")
          .transition(200)
          .style("fill-opacity", 0.1);
        g.selectAll(z)
          .transition(200)
          .style("fill-opacity", 0.7);
      })
      .on("mouseout", function() {
        g.selectAll("polygon")
          .transition(200)
          .style("fill-opacity", cfg.opacityArea);
      });
    series++;
  });
}

/*
@id - id of svg container.
@data - data at the particular format
@options - chart options
*/
export function drawRadarChart(id, data, options) {
  const cfg = getDefaultConfiguration(options);
  setMaxValue(cfg, data);
  const allAxis = data.map(value => value.axis);
  const total = allAxis.length;
  const radius = getRadarRadius(cfg);
  const format = d3.format("%");
  const svg = creatMainSvgElement(id, cfg); //Previous variable name "g"
  var tooltip;
  createCircularSegments(cfg, radius, svg, allAxis);
  addCircularSegmentIndicators(cfg, svg, radius);
  createAxis(cfg, svg, total);

  
  series = 0;

  d.forEach(function(y, x) {
    g.selectAll(".nodes")
      .data(y)
      .enter()
      .append("svg:circle")
      .attr("class", "radar-chart-serie" + series)
      .attr("r", cfg.radius)
      .attr("alt", function(j) {
        return Math.max(j.value, 0);
      })
      .attr("cx", function(j, i) {
        dataValues.push([
          (cfg.w / 2) *
            (1 -
              (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) *
                cfg.factor *
                Math.sin((i * cfg.radians) / total)),
          (cfg.h / 2) *
            (1 -
              (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) *
                cfg.factor *
                Math.cos((i * cfg.radians) / total))
        ]);
        return (
          (cfg.w / 2) *
          (1 -
            (Math.max(j.value, 0) / cfg.maxValue) *
              cfg.factor *
              Math.sin((i * cfg.radians) / total))
        );
      })
      .attr("cy", function(j, i) {
        return (
          (cfg.h / 2) *
          (1 -
            (Math.max(j.value, 0) / cfg.maxValue) *
              cfg.factor *
              Math.cos((i * cfg.radians) / total))
        );
      })
      .attr("data-id", function(j) {
        return j.axis;
      })
      .style("fill", cfg.color(series))
      .style("fill-opacity", 0.9)
      .on("mouseover", function(d) {
        newX = parseFloat(d3.select(this).attr("cx")) - 10;
        newY = parseFloat(d3.select(this).attr("cy")) - 5;

        tooltip
          .attr("x", newX)
          .attr("y", newY)
          .text(format(d.value))
          .transition(200)
          .style("opacity", 1);

        z = "polygon." + d3.select(this).attr("class");
        g.selectAll("polygon")
          .transition(200)
          .style("fill-opacity", 0.1);
        g.selectAll(z)
          .transition(200)
          .style("fill-opacity", 0.7);
      })
      .on("mouseout", function() {
        tooltip.transition(200).style("opacity", 0);
        g.selectAll("polygon")
          .transition(200)
          .style("fill-opacity", cfg.opacityArea);
      })
      .append("svg:title")
      .text(function(j) {
        return Math.max(j.value, 0);
      });

    series++;
  });
  //Tooltip
  tooltip = g
    .append("text")
    .style("opacity", 0)
    .style("font-family", "sans-serif")
    .style("font-size", "13px");
}
