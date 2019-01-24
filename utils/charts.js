export function canDrawProcessInMonitoringChart() {
  const processInMonitoring = this.$store.state.logger.processInMonitoring;
  return processInMonitoring && processInMonitoring.processCpuUtilizationArray ? true : false;
}

export function getPerformanceData() {
  const processInMonitoring = this.$store.state.logger.processInMonitoring;
  const data =  processInMonitoring.processCpuUtilizationArray.map((value, index) => {
    return {
      cpuUtilization: value,
      timeStamp: index,
    }
  });
  return data;
}

export function setChartAreaSize(charts) {
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

export function getChartSizeByParentVueComponent(parent) {

}

export function getChartSizeByParentDomElement(element) {
  if(element instanceof HTMLElement) {
    throw Error(`Incorrect type of received element for getting size`);
  }
  const parentIsValid = element.parentElement && element.parentElement instanceof HTMLElement;
  if (!parentIsValid) {
    throw Error(`Incorrect type of elements parent for getting size`);
  }
  const size = element.parentElement.getBoundingClientRect();
  return {
    width: size.width,
    height: size.height,
  }
}