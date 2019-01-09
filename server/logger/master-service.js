'use strict'
const { EventEmitter } = require('events');
const { isMaster, isWorker, worker } = require('cluster');
const { cpus } = require('os');
const { interval } = require('rxjs'); 
const { map, pairwise} = require('rxjs/operators');
const ws = require('ws');
const consola = require('consola');
const { throwError, handleError } = require('../helpers/error-handler');

const messageEvent = 'log-message';
const processStoreName = 'process-node';
const validDataTypes = ['cpu-node', 'process-node', 'http-node', 'performance-node'];
const setToZero = ['cpu-node', 'http-node', 'performance-node'];

function createProcessNode() {
    const result = Object.assign({}, process.cpuUsage(), 
        process.memoryUsage(), getNodeIds());
    result.cpuData = createCpuUtilizationNode();
    result.type = "process-node";
    result.system = result.system * 0.001;
    result.user = result.user * 0.001;
    result.isMaster = isMaster;
    return result;
}

function createCpuUtilizationNode() {
    let cpusData =  cpus();
    const result = cpusData.reduce((acc, value) => {
        let totalTime = 0;
        for (const prop in value.times) {
            acc[prop] += value.times[prop];
            totalTime += value.times[prop];
        }
        acc.totalIdle += value.times.idle;
        acc.totalTime += totalTime;
        return acc;
    }, {user: 0, nice: 0, sys: 0, idle: 0, irq: 0, totalIdle: 0, totalTime: 0});
    return result;
}

function getNodeIds() {
    const node = {};
    node.timeStamp = Date.now();
    node.pid = process.pid;
    node.host = process.env.host;
    node.port = process.env.port;
    return node;
}

function calculateCpuUtilizationRate(newValue, oldValue) {
    newValue.cpuUtilization = 100 - ~~(100*
        (newValue.cpuData.totalIdle - oldValue.cpuData.totalIdle)
        /(newValue.cpuData.totalTime - oldValue.cpuData.totalTime));
    newValue.processUtilization = (newValue.system + newValue.user)/(oldValue.system + oldValue.user) - 1;
    const generalDiff = (newValue.cpuData.user + newValue.cpuData.sys) - (oldValue.cpuData.user + oldValue.cpuData.sys);
    const processDiff = (newValue.user + newValue.system) - (oldValue.user + oldValue.system);
    newValue.cpuAdjustmentRate = processDiff/generalDiff * 100;
    return newValue;
}

function calculateRps(newValue, oldValue) {
    newValue.requestPerSecond = newValue.requestsCount - oldValue.requestsCount;
    return newValue;
}

function createProcessInfoSubscription() {
    const observable = interval(1000);
    const pair = observable.pipe(
        map(v => createProcessNode()),
        pairwise()
    );
    const subscription = pair.subscribe({
        next: (values) => {
            const node = calculateCpuUtilizationRate(values[1], values[0]);
            isWorker ? process.send(node) : process.emit(messageEvent, node);
        },
        error: (err) => {
            handleError(err);
        }
    });
    return subscription;
}

function addProcessNodeToStore(data, store) {
    const index = store[data.type].findIndex(v => v.pid === data.pid);
    if (index >=0) {
        store[data.type][index] = Object.assign(store[data.type][index], data);
    } else {
        data.bytesRead = 0;
        data.bytesWritten = 0;
        data.requestsCount = 0;
        store[data.type].push(data);
    }
}

function addHttpNodeToStore(data, store) {
    store[data.type].push(data);
    const index = store[processStoreName].findIndex(v => v.pid === data.pid);
    if (index >= 0) {
        store[processStoreName][index].bytesRead += data.bytesRead;
        store[processStoreName][index].bytesWritten += data.bytesWritten;
        store[processStoreName][index].requestsCount += 1;
    }
}

function addHttpPerformanceTracker(req, res, next) {
  const httpMessage = Object.assign({}, getNodeIds());
  httpMessage.startAt = Date.now();
  res.addListener('finish', () => {
    setPropertiesFromSource(['bytesRead', 'bytesWritten', 'remoteAddress', 'remotePort'], httpMessage, req.connection);
    setPropertiesFromSource(['method', 'protocol', 'path', 'url'], httpMessage, req);
    httpMessage.endAt = httpMessage.timeStamp = Date.now();
    httpMessage.pid = process.pid;
    httpMessage.host = process.env.host;
    httpMessage.port = process.env.port;
    httpMessage.workerId = worker ? worker.id : 0;
    httpMessage.type = 'http-node';
    process.send(httpMessage);
  });
  next();
}

function setPropertiesFromSource(properties, obj, source) {
    for (let prop of properties) {
        if (prop in source) obj[prop] = source[prop];
    }
}

class LogsServiceMaster extends EventEmitter {
    constructor(app) {
        super();
        const isValid = isMaster ? 
        (this.addClassMembers(app),
         this.addDataProcessingFunctions(), 
         this.addLogsStoreMember(),
         this.addChildrenListeners(),
         this.addProcessListeners(),
         this.createLogsWebSocket(app)) 
        : throwError(`Can't create master service in child process`);
    }
    addClassMembers(app) {
        this.subscriptions = new Map();
        this.childProcess = [...app.childProcess && app.childProcess instanceof Array ? app.childProcess : []];
    }
    addDataProcessingFunctions() {
        this.dataProcessingFunc = new Map();
        this.dataProcessingFunc.set(processStoreName, addProcessNodeToStore);
        this.dataProcessingFunc.set('http-node', addHttpNodeToStore);
    }
    addLogsStoreMember() {
        this.logsStore = { };
        validDataTypes.forEach(v => this.logsStore[v] = []);
    }
    addChildrenListeners() {
        this.childProcess.forEach(v => v.on('message', (data) => {
            this.serveData(data);
        }));
    }
    addProcessListeners() {
        process.on(messageEvent, (data) => {
            this.serveData(data);
        });
    }
    createLogsWebSocket(app) {
      this.ws = new ws.Server({
        server: app.server
      });
      this.ws.on('connection', (socket) => {
        this.addSocketListeners(socket);
        this.startDataTransferringToWs(socket);
      });
    }
    addSocketListeners(socket) {
      socket.on('message', (message) => {
        this.runCommand(message);
      });
      socket.on('close', () => {
        this['stop-data-transferring']();
      });
    }
    runCommand(name) {
        if (this[name]) {
            this[name](name); 
            this.childProcess.forEach(v => v.send(name));
        }
    }
    serveData(data) {
        if (this.dataProcessingFunc.has(data.type)) {
            this.dataProcessingFunc.get(data.type)(data, this.logsStore);
        }
    }
    startDataTransferringToWs(socket) {
      const observable = interval(1000);
      const subscription = observable.subscribe({
        next: (value) => {
          for (const prop in this.logsStore) {
            this.logsStore[prop]
              .forEach(node => {
                socket.send(JSON.stringify(node));
              });
            if (setToZero.find(v => v === prop)) {
              this.logsStore[prop] = [];
            }
          }
        }
      })
      this.subscriptions.set('data-transferring', subscription);
    }
    'stop-data-transferring'(){
        if (this.subscriptions.has('data-transferring')) {
            this.subscriptions.get('data-transferring').unsubscribe();
        }
    }
    'start-process-monitoring'(name){
        this.subscriptions.set(name, createProcessInfoSubscription());
    }
    'stop-process-monitoring'() {
        if (this.subscriptions.has('start-process-monitoring')) {
            consola.success({ message: `process monitoring stopped ${process.pid}`});
            this.subscriptions.get('start-process-monitoring').unsubscribe();
        }
    }
}

class LogsServiceChild extends EventEmitter {
    constructor() {
        super();
        const isValid = isWorker ? 
        (this.addClassMembers(),  this.addProcessListeners()) 
        : throwError(`Can't create master service in child process`);
    }
    addClassMembers() {
        this.subscriptions = new Map();
    }
    addProcessListeners() {
        process.on('message', (message) => {
            this.runCommand(message);
        });
    }
    runCommand(name) {
        if (this[name]) {
            this[name](name);
        }
    }
    'start-process-monitoring'(name){
        this.subscriptions.set(name, createProcessInfoSubscription());
    }
    'stop-process-monitoring'() {
        if (this.subscriptions.has('start-process-monitoring')) {
            consola.success({ message: `process monitoring stopped ${process.pid}`});
            this.subscriptions.get('start-process-monitoring').unsubscribe();
        }
    }
}

module.exports = { LogsServiceMaster, LogsServiceChild, addHttpPerformanceTracker, getNodeIds };