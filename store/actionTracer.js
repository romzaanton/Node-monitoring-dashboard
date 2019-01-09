export const state = () => ({
    httpMessageCounter: 0,
    httpActionsList: [],
})

export const mutations = {
    addHTTPAction(state, payload) {
        state.httpMessageCounter++;
        payload.count = state.httpMessageCounter;
        state.httpActionsList.unshift(payload);
    }
}