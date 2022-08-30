import { defineStore } from "pinia";

export const useCounterStore = defineStore({
  id: "counter",
  state: () => ({
    testNum: 0
  }),
  getters: {
    doubleCount: (state) => state.testNum * 2
  },
  actions: {
    increment() {
      this.testNum ++;
    },
  },
});
