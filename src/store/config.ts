export default {
    state: {
      config: {}
    },
    mutations: {
      setConfig(state, config) {
        state.config = config;
      }
    },
    actions: {
      async fetchConfig({ commit }) {
        try {
          const response = await fetch('/config.json');
          const data = await response.json();
          commit('setConfig', data);
        } catch (error) {
          console.error('Error fetching the config:', error);
        }
      }
    }
  }
  