'use strict'
const { worker } = require('cluster');
const { getNodeIds } = require('./master-service');

const asyncHandler = {
  apply: async function (target, thisArg, args) {
    const timeNode = createTimeNodeForFunction(target);
    for (let i in args) {
      if (args[i] instanceof Function) {
        args[i] = new Proxy(args[i], this);
      }
    }
    const funcResult = await target.apply(thisArg, args);
    timeNode.endAt = Date.now();
    pushMessageToLoggerProcess(timeNode);
    return funcResult;
  },
};

const syncHandler = {
  apply: function (target, thisArg, args) {
    const timeNode = createTimeNodeForFunction(target);
    for (let i in args) {
      if (args[i] instanceof Function) {
        args[i] = new Proxy(args[i], this);
      }
    }
    const funcResult = target.apply(thisArg, args);
    timeNode.endAt = timeNode.timeStamp = Date.now();
    pushMessageToLoggerProcess(timeNode);
    return funcResult;
  },
};

function createTimeNodeForFunction(target) {
  const node = Object.assign({}, getNodeIds());
  node.funcName = target.name;
  node.startAt = node.timeStamp = node.endAt = Date.now();
  node.pid = process.pid;
  node.host = process.env.host;
  node.port = process.env.port;
  node.workerId = worker ? worker.id : 0;
  node.type = 'performance-node';
  return node;
}

function createFunctionProxy(func, thisArg, args) {
  let proxy;
  if (func.__proto__[Symbol.toStringTag] === 'AsyncFunction') {
    proxy = new Proxy(func, asyncHandler);
  } else {
    proxy = new Proxy(func, syncHandler);
  }
  return proxy.apply(thisArg, args);
}

function pushMessageToLoggerProcess(message) {
  process.send(message);
}

module.exports = { createFunctionProxy }
