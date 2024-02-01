<template>
  <div class="q-pa-md">
    <q-table
      style="height: 400px"
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="index"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
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
</template>

<script setup>
import axios from 'axios';
import { reactive, ref, computed, nextTick } from 'vue';
import { useQuasar } from 'quasar';
import { useCounterStore } from 'stores/counter';
import { storeToRefs } from 'pinia';

const confList = reactive({
  data: [],
});
axios.get('/api/test').then(res => {
  //confObject = res.data
  console.log(res.data);
  confList.data = res.data;
  //console.log(confList.data);

  for (let i = 0; i < 1000; i++) {
    rows = rows.concat(confList.data.slice(0).map(r => ({ ...r })));
  }
  rows.forEach((row, index) => {
    row.index = index;
  });
  console.log(rows);
});
pagination: ref({
  rowsPerPage: 1,
});

// we generate lots of rows here
let rows = [];

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

pagination: ref({
  rowsPerPage: 1000,
});
</script>

<style lang="scss" scoped>
/*다크모드*/
body.body--dark {
  background: #000;
}
/*테이블 관련*/
.my-sticky-dynamic {
  /* height or max-height is important */
  height: 410px;
}

.q-table__top,
.q-table__bottom,
thead tr:first-child th {
  /* bg color is important for th; just specify one */
  background-color: #00b4ff;
}
thead tr th {
  position: sticky;
  z-index: 1;
}
/* this will be the loading indicator */
thead tr:last-child th {
  /* height of all previous header rows */
  top: 48px;
}
thead tr:first-child th {
  top: 0;
}
/* prevent scrolling behind sticky top row on focus */
tbody
    /* height of all previous header rows */ {
  scroll-margin-top: 48px;
}
</style>
