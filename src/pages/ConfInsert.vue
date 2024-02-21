<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
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
      <!--
      <q-toggle v-model="accept" label="I accept the license and terms" /> -->

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
</template>

<script setup>
import axios from 'axios';
import { reactive, ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const codeId = ref(null);
const codeValue = ref(null);
const codeName = ref(null);
const codeDesc = ref(null);
const accept = ref(false);

function onReset() {
  codeId.value = null;
  codeValue.value = null;
  codeName.value = null;
  codeDesc.value = null;
  accept.value = false;
}
function onSubmit() {
  const param = {
    codeId: codeId.value,
    codeValue: codeValue.value,
    codeName: codeName.value,
    codeDesc: codeDesc.value,
    creatId: 'ani',
  };
  axios.post('/api/insert', { param }).then(res => {
    console.log(res.data);
  });
}
</script>

<style lang="scss" scoped>
body.body--dark {
  background: #000;
}
</style>
