<template>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-dynamic"
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      :loading="loading"
      row-key="index"
      virtual-scroll
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      :pagination="pagination"
      :rows-per-page-options="[0]"
      @virtual-scroll="onScroll"
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

// axios.post('/api/confList').then(res => {
//   //confObject = res.data
//   console.log(res.data);
//   confList.data = res.data;
//   console.log(confList.data);
// });
axios.get('/api/test').then(res => {
  //confObject = res.data
  console.log(res.data);
  confList.data = res.data;
  console.log(confList.data);
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
    field: 'index'
  },
  {
    name: 'name',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    field: row => row.name,
    format: val => val,
    sortable: true
  },
  { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
  { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
  { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
]

const seed = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: '6%',
    iron: '7%'
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%'
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%'
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50,
    calcium: '0%',
    iron: '0%'
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%'
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%'
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%'
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%'
  }
]

// we generate lots of rows here
let allRows = []
for (let i = 0; i < 1000; i++) {
  allRows = allRows.concat(seed.slice(0).map(r => ({ ...r })))
}
allRows.forEach((row, index) => {
  row.index = index
})

const pageSize = 50
const lastPage = Math.ceil(allRows.length / pageSize)

const nextPage = ref(2)
const loading = ref(false)

const rows = computed(() => allRows.slice(0, pageSize * (nextPage.value - 1)))

onScroll ({ to, ref }) {
  const lastIndex = rows.value.length - 1

  if (loading.value !== true && nextPage.value < lastPage && to === lastIndex) {
    loading.value = true

    setTimeout(() => {
      nextPage.value++
      nextTick(() => {
        ref.refresh()
        loading.value = false
      })
    }, 500)
  }
}
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
