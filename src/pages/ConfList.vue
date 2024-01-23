<template>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 300px">
      <q-input v-model="text" label="Standard" />
    </div>
  </div>
  <ul>
    <li>여기는 [{}] 구조의 reactive</li>
    <li>{{ confList.value }}</li>
    <li v-for="(value2, idx) in confList.data" :key="idx">
      : {{ value2.name }}
    </li>
  </ul>
</template>

<script setup>
import axios from 'axios';
import { reactive, ref } from 'vue';

const confList = reactive({
  data: [],
});

axios.post('/api/confObject').then(res => {
  //confObject = res.data
  confList.data = res.data;
});
</script>

<style lang="scss" scoped>
body.body--dark {
  background: #000;
}
</style>
