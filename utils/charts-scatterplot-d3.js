import * as d3 from 'd3';
import { deleteSvgChildren, setSizeParamsToConfig, setSvgSize, setColorInterpolatorToConfig } from './charts';

export function createScatterPlotChart(container, id, config) {
    deleteSvgChildren(id);
    setSizeParamsToConfig(container, config);
    setSvgSize(config, id);
    setWrapperToConfig(id, config);
    setColorInterpolatorToConfig(config, d3.schemePaired);
    setXScaleToConfig(config);
}

function setWrapperToConfig(id, config) {
    config.wrapper = d3.select(`#${id}`).append('g')
    .attr('class', 'chordWrapper')
    .attr('transform', `translate(${config.margin.left}, ${config.margin.top})`);
}

function setXScaleToConfig(config) {
    config.xScale = d3.scaleLog().range([0, config.width]).domain([100, 2e5]);
}

function setXAxisToConfig(config) {
    const axis = null;
    const axisX = null;
    const axisY = null;
    const axisZ = null;
<<<<<<< HEAD
    const newFeatureV2 = null;
    const someNewFeature = null;
    const newFeatureV3 = null;
}
=======
    const newFeature2 = null;
}
>>>>>>> master
