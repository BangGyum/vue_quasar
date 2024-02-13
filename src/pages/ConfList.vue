<template>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-header-table"
      flat
      bordered
      title="Treats"
      :rows="rows.data"
      :columns="columns"
      v-model:selected="selected"
      selection="single"
      row-key="CODE_ID"
      @row-dblclick="tableDoubleClick"
    />
  </div>

  <div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div>

  <q-btn to="/confUpdate" label="To Docs index" outline color="purple" />

  <div class="q-pa-md">
    <q-btn label="Click Me" @click="showAlert" />
  </div>
</template>

<script setup>
import axios from 'axios';
import { reactive, ref, computed, nextTick } from 'vue';
import { useQuasar } from 'quasar';
import { useCodeStore } from 'stores/codeStore';
//import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const selected = ref([]);

const codeStore = useCodeStore();
const router = useRouter();

const rows = reactive({
  data: [],
});
const codeList = reactive({
  data: [],
});
axios.get('/api/test').then(res => {
  codeList.data = res.data;
  //console.table(codeList.data);

  for (let i = 0; i < 1; i++) {
    rows.data = rows.data.concat(codeList.data.slice(0).map(r => ({ ...r })));
  }
  rows.data.forEach((row, index) => {
    row.index = index;
  });
});

const $q = useQuasar();

const codeId = computed(() => codeStore.codeId);
const codeValue = computed(() => codeStore.codeValue);
const codeName = computed(() => codeStore.codeName);
const codeDesc = computed(() => codeStore.codeDesc);
codeId.value = '44';

const accept = ref(false);

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
  axios.post('/api/savecode/' + idx, { param }).then(res => {
    console.log(res.data);
  });
}

function tableDoubleClick(evt, row, index) {
  console.table(row);
  // codeStore.codeId(row.CODE_ID);
  // codeStore.codeValue(row.CODE_VALUE);
  // codeStore.codeName(row.CODE_NAME);

  //codeStore.codeDesc;
  codeStore.$patch({
    codeId: row.CODE_ID,
    codeName: row.CODE_NAME,
    codeValue: row.CODE_VALUE,
    codeDesc: row.CODE_DESC,
  });
  console.log(codeStore.codeValue);
  router.push('/confUpdate');
}

const showAlert = () => {
  $q.dialog({
    title: 'Confirm',
    message: 'Button clicked!',
    ok: 'OK',
  });
};

//--------------------------------------------------------
const columns = [
  {
    name: 'index',
    label: '#',
    field: 'index',
  },
  {
    name: 'CODE_ID',
    //required: true,
    label: 'CODE_ID',
    align: 'left',
    field: 'CODE_ID', //여기가 컬럼에 값
    //field: row => row.name,
    //format: val => `${val}`,
    sortable: true,
  },
  {
    name: 'CODE_VALUE',
    align: 'left',
    label: 'CODE_VALUE',
    field: 'CODE_VALUE',
    sortable: true,
  },
  {
    name: 'CODE_NAME',
    label: 'CODE_NAME ',
    field: 'CODE_NAME',
    sortable: true,
  },
  { name: 'CODE_DESC', label: 'CODE_DESC ', field: 'CODE_DESC' },

  { name: 'CREATE_ID', label: 'CREATE_ID ', field: 'CREATE_ID' },
  {
    name: 'UPDATE_DT',
    label: 'UPDATE_DT',
    field: 'UPDATE_DT',
    sortable: true,
    //sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  { name: 'CREATE_DT', label: 'CREATE_DT ', align: 'left', field: 'CREATE_DT' },
  {
    name: 'UPDATE_ID',
    label: 'UPDATE_ID',
    field: 'UPDATE_ID',
    sortable: true,
    //sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
];
</script>
<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 400px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #ADD8E6
    color: black

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>
