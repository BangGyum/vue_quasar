<template>
  <div class="q-pa-md">마우스 위치: {{ x }}, {{ y }}</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useFetch } from 'src/functions/fetch.js';

const { data, error } = useFetch('/api/test');
console.log('----error');
console.log(error.value);
console.log('----data');
console.log(data);
const x = ref(0);
const y = ref(0);

function update(event) {
  x.value = event.pageX;
  y.value = event.pageY;
}

onMounted(() => window.addEventListener('mousemove', update));
onUnmounted(() => window.removeEventListener('mousemove', update));
</script>
<style lang="sass"></style>
