import { connectionConfig } from '~/server/config/connection.config';

const host = connectionConfig.host;
const port = connectionConfig.port;


export const state = () => ({
    logsWebSocket: undefined,
    'process-node': [],
    'cpu-node': [],
    'http-node': [],
    'performance-node': [],
    'cpu-utilization': [],
})

export const mutations = {
    setWebSocket(state, payload) {
        state.logsWebSocket = payload;
    },
    'process-node'(state, payload) {
        const index = state['process-node'].findIndex(v => v.pid === payload.pid);
        if (index >= 0) {
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
    if (length < 60) {
        state['cpu-utilization'].unshift(node);
    } else if (length >= 60) {
        state['cpu-utilization'].pop();
        state['cpu-utilization'].unshift(node);
    }

    state['cpu-utilization'] = state['cpu-utilization'].map((v, index) => {
        v.timeStamp = index;
        return v;
    });
}