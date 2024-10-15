// src/store.js
import { createStore } from 'vuex';

export const store = createStore({
  state: {
    isAuthenticated: false, // Add other state variables as needed
    user: null,
  },
  mutations: {
    setAuthenticated(state, status) {
      state.isAuthenticated = status;
    },
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    login({ commit }, user) {
      commit('setAuthenticated', true);
      commit('setUser', user);
    },
    logout({ commit }) {
      commit('setAuthenticated', false);
      commit('setUser', null);
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
  },
});
