<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-form @submit="onConsoleLog" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        v-model="confId"
        label="공통코드 ID "
        hint="confId"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        filled
        v-model="confValue"
        label="공통코드 VALUE "
        hint="confValue"
        lazy-rules
        :rules="[
          val => !!val || '* Required',
          val => val.length < 30 || 'Please use maximum 20 character',
        ]"
      />

      <q-input
        filled
        v-model="confName"
        label="공통코드 NAME "
        hint="confName"
        lazy-rules
        :rules="[
          val => !!val || '* Required',
          val => val.length < 100 || 'Please use maximum 100 character',
        ]"
      />

      <q-input
        filled
        v-model="confDesc"
        label="공통코드 설명 "
        hint="confDesc"
        lazy-rules
        :rules="[
          val => !!val || '* Required',
          val => val.length < 255 || 'Please use maximum 255 character',
        ]"
      />

      <q-toggle v-model="accept" label="I accept the license and terms" />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
  <ul>
    <li>여기는 [{}] 구조의 reactive</li>
    <li>{{ confList.value }}</li>
    <li v-for="(value2, idx) in confList.data" :key="idx">
      : {{ value2.name }}
    </li>
  </ul>
  <div>
    <!-- Option 1 -->
    <div>Direct store</div>
    <!-- Read the state value directly -->
    <div>{{ store.counter }}</div>
    <!-- Use getter directly -->
    <div>{{ store.doubleCount }}</div>

    <!-- Manipulate state directly -->
    <q-btn @click="store.counter--">-</q-btn>
    <!-- Use an action -->
    <q-btn @click="store.increment()">+</q-btn>
  </div>

  <div>
    <!-- Option 2 -->
    <div>Indirect store</div>
    <!-- Use the computed state -->
    <div>{{ count }}</div>
    <!-- Use the computed getter -->
    <div>{{ doubleCountValue }}</div>

    <!-- Use the exposed function -->
    <q-btn @click="decrementCount()">-</q-btn>
    <!-- Use the exposed function -->
    <q-btn @click="incrementCount()">+</q-btn>
  </div>

  <div>
    <!-- Option 3 -->
    <div>Destructured store</div>
    <!-- Use the destructured state -->
    <div>{{ counter }}</div>
    <!-- Use the destructured getter -->
    <div>{{ doubleCount }}</div>

    <!-- Manipulate state directly-->
    <q-btn @click="counter--">-</q-btn>
    <!-- Use an action -->
    <q-btn @click="increment()">+</q-btn>
  </div>
</template>

<script setup>
import axios from 'axios';
import { reactive, ref } from 'vue';
import { useQuasar } from 'quasar';

const confList = reactive({
  data: [],
});

axios.post('/api/confObject').then(res => {
  //confObject = res.data
  confList.data = res.data;
});
const $q = useQuasar();

const confId = ref(null);
const confValue = ref(null);
const confName = ref(null);
const confDesc = ref(null);
const accept = ref(false);

function onReset() {
  confId.value = null;
  confValue.value = null;
  confName.value = null;
  confDesc.value = null;
  accept.value = false;
}
function onConsoleLog() {
  const param = {
    confId: confId.value,
    confValue: confValue.value,
    confName: confName.value,
    confDesc: confDesc.value,
    creatId: 'ani',
  };
  const idx = 1;
  axios.post('/api/saveConf/' + idx, { param }).then(res => {
    console.log(res.data);
  });
}

import { computed } from 'vue';
import { useCounterStore } from 'stores/counter';
import { storeToRefs } from 'pinia';

const store = useCounterStore();

// Option 2: use computed and functions to use the store
const count = computed(() => store.counter);
const doubleCountValue = computed(() => store.doubleCount);
const incrementCount = () => store.increment(); // use action
const decrementCount = () => store.counter--; // manipulate directly

// Option 3: use destructuring to use the store in the template
const { counter, doubleCount } = storeToRefs(store); // state and getters need "storeToRefs"
const { increment } = store; // actions can be destructured directly
</script>

<style lang="scss" scoped>
body.body--dark {
  background: #000;
}
</style>
