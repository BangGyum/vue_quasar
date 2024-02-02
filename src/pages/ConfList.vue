<template>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-header-table"
      flat
      bordered
      title="Treats"
      :rows="rows.data"
      :columns="columns"
      row-key="name"
      @row-dblclick="tableDoubleClick"
    />
  </div>
  <div>
    <!-- Option 1 -->
    <div>Direct store</div>
    <!-- Read the state value directly -->
    <div>{{ store.count }}</div>
    <!-- Use getter directly -->
    <div>{{ store.doubleCount }}</div>
    <div>{{ store.quadrupleCount }}</div>

    <!-- Manipulate state directly -->
    <q-btn @click="store.count--">-</q-btn>
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
    <q-btn @click="count--">-</q-btn>
    <!-- Use an action -->
    <q-btn @click="increment()">+</q-btn>
  </div>

  <q-btn to="/confInsert" label="To Docs index" outline color="purple" />
</template>

<script setup>
import axios from 'axios';
import { reactive, ref, computed, nextTick } from 'vue';
import { useQuasar } from 'quasar';
import { useCounterStore } from 'stores/counter';
import { storeToRefs } from 'pinia';

const rows = reactive({
  data: [],
});
const confList = reactive({
  data: [],
});
axios.get('/api/test').then(res => {
  //confObject = res.data
  //console.log(res.data);
  confList.data = res.data;
  console.log(confList.data);

  for (let i = 0; i < 1000; i++) {
    rows.data = rows.data.concat(confList.data.slice(0).map(r => ({ ...r })));
  }
  rows.data.forEach((row, index) => {
    row.index = index;
  });
});
pagination: ref({
  rowsPerPage: 1,
});

// we generate lots of rows here

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
function tableDoubleClick(evt, row, index) {
  console.log(evt);
  console.log(row);
  console.log(index);
}

const store = useCounterStore();

// Option 2: use computed and functions to use the store
const count = computed(() => store.count);
const quadruple = computed(() => store.quadrupleCount);
const doubleCountValue = computed(() => store.doubleCount);
const incrementCount = () => store.increment(); // use action
const decrementCount = () => store.count--; // manipulate directly

// Option 3: use destructuring to use the store in the template
const { counter, doubleCount } = storeToRefs(store); // state and getters need "storeToRefs"
const { increment } = store; // actions can be destructured directly
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

const linksList = [
  //여기의 메뉴 목록은 위에 EssenstialLink 컴포넌트로 렌더링되기 때문에 위에서 수정
  {
    title: 'Typography',
    caption: 'quasar.dev',
    icon: 'school',
    to: '/typography',
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
