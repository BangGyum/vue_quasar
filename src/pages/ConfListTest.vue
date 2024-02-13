<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="CODE_ID"
      selection="single"
      v-model:selected="selected"
    />

    <div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, reactive } from 'vue';
const rows = ref([]);
let rows3 = [];
const codeList = reactive({
  data: [],
});
axios.get('/api/test').then(res => {
  codeList.data = res.data;
  rows3 = res.data;
  //console.table(res.data);
  console.log(rows3);

  for (let i = 0; i < 1; i++) {
    rows.value = rows.value.concat(codeList.data.slice(0).map(r => ({ ...r })));
  }
  rows.value.forEach((row, index) => {
    row.index = index;
  });
});

const selected = ref([]);

const columns2 = [
  {
    name: 'name',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true,
  },
  {
    name: 'calories',
    align: 'center',
    label: 'Calories',
    field: 'calories',
    sortable: true,
  },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
  {
    name: 'calcium',
    label: 'Calcium (%)',
    field: 'calcium',
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: 'iron',
    label: 'Iron (%)',
    field: 'iron',
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
];

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
const rows4 = ref([
  {
    CODE_ID: 'CODE10',
    CODE_VALUE: '공통코드10',
    CODE_NAME: '공통코드1000',
    CODE_DESC: '공통코드10090',
    DEL_YN: 'N',
    CREATE_DT: '2024-02-01T16:44:23.120Z',
    UPDATE_DT: '2024-02-07T17:31:15.247Z',
    CREATE_ID: 'NULL',
    UPDATE_ID: 'aniUpdate',
  },
  {
    CODE_ID: 'CODE2',
    CODE_VALUE: '공통코드2',
    CODE_NAME: '공통코드2',
    CODE_DESC: '공통코드2',
    DEL_YN: 'N',
    CREATE_DT: '2024-02-01T16:42:56.703Z',
    UPDATE_DT: '2024-02-01T16:42:56.703Z',
    CREATE_ID: 'NULL',
    UPDATE_ID: 'NULL',
  },
]);

const rows2 = ref([
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: '14%',
    iron: '1%',
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%',
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: '6%',
    iron: '7%',
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%',
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%',
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50,
    calcium: '0%',
    iron: '0%',
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%',
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%',
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%',
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%',
  },
]);

// const tableRef = ref();
// const rows = ref([]);
// const filter = ref('');
// const loading = ref(false);
// const pagination = ref({
//   sortBy: 'desc',
//   descending: false,
//   page: 1,
//   rowsPerPage: 3,
//   rowsNumber: 10,
// });

// // emulate ajax call
// // SELECT * FROM ... WHERE...LIMIT...
// function fetchFromServer(startRow, count, filter, sortBy, descending) {
//   const data = filter
//     ? originalRows.filter(row => row.name.includes(filter))
//     : originalRows.slice();

//   // handle sortBy
//   if (sortBy) {
//     const sortFn =
//       sortBy === 'desc'
//         ? descending
//           ? (a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0)
//           : (a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
//         : descending
//         ? (a, b) => parseFloat(b[sortBy]) - parseFloat(a[sortBy])
//         : (a, b) => parseFloat(a[sortBy]) - parseFloat(b[sortBy]);
//     data.sort(sortFn);
//   }

//   return data.slice(startRow, startRow + count);
// }

// // emulate 'SELECT count(*) FROM ...WHERE...'
// function getRowsNumberCount(filter) {
//   if (!filter) {
//     return originalRows.length;
//   }
//   let count = 0;
//   originalRows.forEach(treat => {
//     if (treat.name.includes(filter)) {
//       ++count;
//     }
//   });
//   return count;
// }

// function onRequest(props) {
//   console.log('--------------------진입');
//   const { page, rowsPerPage, sortBy, descending } = props.pagination;
//   const filter = props.filter;
//   console.log('page:' + page);
//   console.log(filter);

//   loading.value = true;

//   // emulate server
//   setTimeout(() => {
//     // update rowsCount with appropriate value
//     pagination.value.rowsNumber = getRowsNumberCount(filter);

//     // get all rows if "All" (0) is selected
//     const fetchCount =
//       rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;

//     // calculate starting row of data
//     const startRow = (page - 1) * rowsPerPage;
//     console.log('startRow : ' + startRow);
//     // fetch data from "server"
//     const returnedData = fetchFromServer(
//       startRow,
//       fetchCount,
//       filter,
//       sortBy,
//       descending,
//     );

//     // clear out existing data and add new
//     rows.value.splice(0, rows.value.length, ...returnedData);

//     // don't forget to update local pagination object
//     pagination.value.page = page;
//     pagination.value.rowsPerPage = rowsPerPage;
//     pagination.value.sortBy = sortBy;
//     pagination.value.descending = descending;

//     // ...and turn of loading indicator
//     loading.value = false;
//   }, 1500);
// }

// onMounted(() => {
//   // get initial data from server (1st page)
//   tableRef.value.requestServerInteraction();
// });
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
