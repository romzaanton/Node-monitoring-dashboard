import { connectionConfig } from '~/server/config/connection.config';

const host = connectionConfig.host;
const port = connectionConfig.port;
const monitoringTimeDepth = 60;


export const state = () => ({
    logsWebSocket: undefined,
    processInMonitoring: undefined,
    'process-node': [],
    'cpu-node': [],
    'http-node': [],
    'performance-node': [],
    'cpu-utilization': [],
    monitoringTimeDepth,
})

export const mutations = {
    setWebSocket(state, payload) {
        state.logsWebSocket = payload;
    },
    'process-node'(state, payload) {
        const index = state['process-node'].findIndex(v => v.pid === payload.pid);
        if (index >= 0) {
            payload.requestPerSecond = countRequestPerSecond(payload, state['process-node'][index]);
            state.processInMonitoring = addPerformanceDataToProcessInMonitoring(state.processInMonitoring, payload);
            state['process-node'][index] = payload;
        } else {
            state['process-node'].push(payload);
        }
        if (payload.isMaster) addCpuUtilizationDataToState(state, payload);
        state['process-node'] = state['process-node'].map(v => v);
    },
    'http-node'(state, payload) {
        state['http-node'].push(payload);
    },
    'cpu-node'(state, payload) {
        state['cpu-node'].push(payload);
    },
    'performance-node'(state, payload) {
        state['performance-node'].push(payload);
    },
    setProcessInMonitoring(state, payload) { 
        state.processInMonitoring = state.processInMonitoring ? undefined : payload;
    },
}

export const actions = {
    async createWebSocket({ commit, state }) {
      const connected = await new Promise((resolve, reject) => {
        if (state.logsWebSocket && state.logsWebSocket instanceof WebSocket) {
          resolve(true);
        };
        const webSocket = createWebSocket(commit, state);
        webSocket.onopen = (ev) => {
          commit('setWebSocket', webSocket);
          resolve(true);
        }
        webSocket.onerror = (ev) => {
          reject(ev);
        }
      });

    },
    startProcessesMonitoring({ state }) {
        state.logsWebSocket.send('start-process-monitoring');
    },
    stopProcessesMonitoring({ state }) {
        if (state.logsWebSocket && state.logsWebSocket.readyState === 1) {
            state.logsWebSocket.send('stop-process-monitoring');
        }
    }
    
}

function createWebSocket(commit, state) {
    const webSocket = new WebSocket(`wss://${host}:${port}`);
    addOnMessageListeners(webSocket, commit, state);
    return webSocket;
}

function addOnMessageListeners(webSocket, commit, state) {
    webSocket.onmessage = (messageEvent) => {
        const data = JSON.parse(messageEvent.data);
        if (data.type && (data.type in state)) {
            commit(data.type, data);
        } else {
            throw new Error(`Wrong ws message type received = ${data.messageType}`)
        }
    }
}

function addCpuUtilizationDataToState(state, processNode) {
    const length = state['cpu-utilization'].length;
    const node = {
        timeStamp: 0,
        cpuUtilization: processNode.cpuUtilization,
    };
    if (length < monitoringTimeDepth) {
        state['cpu-utilization'].unshift(node);
    } else if (length >= monitoringTimeDepth) {
        state['cpu-utilization'].pop();
        state['cpu-utilization'].unshift(node);
    }

    state['cpu-utilization'] = state['cpu-utilization'].map((v, index) => {
        v.timeStamp = index;
        return v;
    });
}

function countRequestPerSecond(newNode, oldNode) {
    let requestPerSecond = 0;
    if (newNode.requestsCount && oldNode.requestsCount) {
        requestPerSecond = newNode.requestsCount - oldNode.requestsCount;
    }
    return requestPerSecond;
}

function addPerformanceDataToProcessInMonitoring(processInMonitoring, newNode) {
    const cpuUtilization = newNode.processUtilization;
    if (processInMonitoring && processInMonitoring.processCpuUtilizationArray) {
        const length = processInMonitoring.processCpuUtilizationArray.length;
        if (length < monitoringTimeDepth) {
            processInMonitoring.processCpuUtilizationArray.unshift(cpuUtilization);
        } else if (length >= monitoringTimeDepth) {
            processInMonitoring.processCpuUtilizationArray.pop();
            processInMonitoring.processCpuUtilizationArray.unshift(cpuUtilization);
        }
    } else if (processInMonitoring && !processInMonitoring.processCpuUtilizationArray) {
        processInMonitoring.processCpuUtilizationArray = [];
        processInMonitoring.processCpuUtilizationArray.unshift(cpuUtilization);
    }

    return processInMonitoring;
}