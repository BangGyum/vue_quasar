import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// export const useCounterStore = defineStore('counter', {
//   state: () => ({
//     counter: 0,
//   }),

//   getters: {
//     doubleCount(state) {
//       return state.counter * 2;
//     },
//   },

//   actions: {
//     increment() {
//       this.counter++;
//     },
//   },
// });

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const name = ref('Eduardo');
  const doubleCount = computed(() => count.value * 2);
  const quadrupleCount = computed(() => count.value * 4);
  function increment() {
    count.value++;
  }

  return { count, name, doubleCount, quadrupleCount, increment };
});
