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
        readonly
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
        readonly
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
    <div class="q-pa-md q-gutter-sm">
      <q-btn label="Alert" color="primary" @click="showAlert" />

      <q-dialog v-model="alert">
        <q-card>
          <q-card-section>
            <div class="text-h6">Alert</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            {{ dialogValue }}
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              label="OK"
              color="primary"
              v-close-popup
              @click="goList"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { reactive, ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useCodeStore } from 'stores/codeStore';
import { useRouter } from 'vue-router';
//import { storeToRefs } from 'pinia';

const alert = ref(false);
const dialogValue = ref('-');

const codeStore = useCodeStore();
console.log(codeStore.codeId);

const codeList = reactive({
  data: [],
});
const router = useRouter();
const $q = useQuasar();

const codeId = computed(() => codeStore.codeId);
const codeValue = computed(() => codeStore.codeValue);
const codeName = ref(codeStore.codeName);
const codeDesc = ref(codeStore.codeDesc);

function onReset() {
  codeId.value = null;
  codeValue.value = null;
  codeName.value = null;
  codeDesc.value = null;
}
function onSubmit() {
  const param = {
    codeId: codeId.value,
    codeValue: codeValue.value,
    codeName: codeName.value,
    codeDesc: codeDesc.value,
    updateId: 'aniUpdate',
  };

  axios.post('/api/updateCode', { param }).then(res => {
    console.log(res.data);
    if (res.data === '성공') {
      dialogValue.value = '성공';
      alert.value = true;
      //router.push('/confListServer');
    } else {
      console.log('실패');
    }
  });
}
function goList() {
  router.push('/confListServer');
}

function showAlert() {
  alert.value = true;
}

// function alert() {
//   $q.dialog({
//     dark: true,
//     title: 'Alert',
//     message: 'Some message',
//   })
//     .onOk(() => {
//       // console.log('OK')
//     })
//     .onCancel(() => {
//       // console.log('Cancel')
//     })
//     .onDismiss(() => {
//       // console.log('I am triggered on both OK and Cancel')
//     });
// }
</script>

<style lang="scss" scoped>
body.body--dark {
  background: #000;
}
</style>
