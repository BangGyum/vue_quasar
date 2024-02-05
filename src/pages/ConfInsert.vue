<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-form @submit="onConsoleLog" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        v-model="codeId"
        label="공통코드 ID "
        hint="codeId"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        filled
        v-model="codeValue"
        label="공통코드 VALUE "
        hint="codeValue"
        lazy-rules
        :rules="[
          val => !!val || '* Required',
          val => val.length < 30 || 'Please use maximum 20 character',
        ]"
      />

      <q-input
        filled
        v-model="codeName"
        label="공통코드 NAME "
        hint="codeName"
        lazy-rules
        :rules="[
          val => !!val || '* Required',
          val => val.length < 100 || 'Please use maximum 100 character',
        ]"
      />

      <q-input
        filled
        v-model="codeDesc"
        label="공통코드 설명 "
        hint="codeDesc"
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
    <li>{{ codeList.value }}</li>
    <li v-for="(value2, idx) in codeList.data" :key="idx">
      : {{ value2.name }}
    </li>
  </ul>
</template>

<script setup>
import axios from 'axios';
import { reactive, ref } from 'vue';
import { useQuasar } from 'quasar';

const codeList = reactive({
  data: [],
});

axios.post('/api/codeObject').then(res => {
  //codeObject = res.data
  codeList.data = res.data;
});

// const qantom = [
//   {
//     name: 'yaho',
//     age: 1,
//   },
//   {
//     name: 'yahooo',
//     age: 454,
//   },
// ];
// const idx = 1;
// axios.post('/api/idx/' + idx, { qantom }).then(res => {
//   //codeObject = res.data
//   console.log(res.data);
// });

const $q = useQuasar();

const codeId = ref(null);
const codeValue = ref(null);
const codeName = ref(null);
const codeDesc = ref(null);
const accept = ref(false);

// function onSubmit() {
//   if (accept.value !== true) {
//     $q.notify({
//       color: 'red-5',
//       textColor: 'white',
//       icon: 'warning',
//       message: 'You need to accept the license and terms first',
//     });
//   } else {
//     $q.notify({
//       color: 'green-4',
//       textColor: 'white',
//       icon: 'cloud_done',
//       message: 'Submitted',
//     });
//   }
// }

function onReset() {
  codeId.value = null;
  codeValue.value = null;
  codeName.value = null;
  codeDesc.value = null;
  accept.value = false;
}
function onConsoleLog() {
  const param = {
    codeId: codeId.value,
    codeValue: codeValue.value,
    codeName: codeName.value,
    codeDesc: codeDesc.value,
    creatId: 'ani',
  };
  const idx = 1;
  axios.post('/api/saveCode/' + idx, { param }).then(res => {
    console.log(res.data);
  });
}
</script>

<style lang="scss" scoped>
body.body--dark {
  background: #000;
}
</style>
