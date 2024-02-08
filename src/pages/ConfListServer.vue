<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      ref="tableRef"
      title="Treats"
      :rows="rows.data"
      :columns="columns"
      row-key="name"
      v-model:pagination="pagination"
      :loading="loading"
      :filter="filter"
      binary-state-sort
      @request="onRequest"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>

  <q-btn to="/confUpdate" label="To Docs index" outline color="purple" />
</template>

<script setup>
import axios from 'axios';
import { reactive, ref, computed, nextTick, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useCodeStore } from 'stores/codeStore';
import { useRouter } from 'vue-router';

const codeStore = useCodeStore();
const router = useRouter();

const tableRef = ref();
const filter = ref('');
const loading = ref(false);
const pagination = ref({
  sortOrder: 'code_id',
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 3,
  rowsNumber: 10,
});
// const fetchData = async () => {
//   //const startRow = 0;
//   //const count = 10;
//   //const filter = 'test';
//   //const sortBy = 'name';
//   //const descending = false;
//   const page = pagination.value.page;
//   const rowsPerPage = pagination.value.rowsPerPage;
//   const sortOrder = pagination.value.sortOrder;

//   rows2.data = await fetchFromServer(page, rowsPerPage, sortOrder);
// };
// onMounted(fetchData);

const rows = reactive({
  //table에 직접 들어갈
  data: [],
});

//페이징
async function fetchFromServer(startRow, rowsPerPage, sortOrder) {
  console.log(
    'fetchFromServer 진입 : ' + startRow + ',' + rowsPerPage + ',' + sortOrder,
  );
  try {
    const response = await axios.post('/api/data', {
      params: {
        page: 0,
        startRow: startRow,
        rowsPerPage: rowsPerPage,
        sortOrder: 'CODE_ID',
      },
    });
    //console.log('오류안난듯');
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

pagination.value.rowsNumber = getRowsNumberCount('필터데이터');

async function getRowsNumberCount(filter) {
  try {
    const response = await axios.get('/api/getConfigCount', {
      params: {
        filterValue: filter,
      },
    });
    //console.log('오류안난듯count');
    //console.log(response.data[0].COUNT);
    return response.data[0].COUNT;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

async function onRequest(props) {
  console.log('--------------------진입');
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  const filter = props.filter;
  console.log('page:' + page);
  console.log(filter);

  loading.value = true;

  try {
    pagination.value.rowsNumber = await getRowsNumberCount(
      '일단 임시 필터데이터',
    );
    const fetchCount =
      rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;
    const startRow = (page - 1) * rowsPerPage;
    const returnedData = await fetchFromServer(
      startRow,
      fetchCount,
      //filter,
      sortBy,
      //descending,
    );

    console.log(returnedData);
    // if (!Array.isArray(rows.value)) {
    //   rows.value = [];
    // }
    rows.data.splice(0, rows.data.length, ...returnedData);

    pagination.value.page = page;
    pagination.value.rowsPerPage = rowsPerPage;
    pagination.value.sortBy = sortBy;
    pagination.value.descending = descending;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  tableRef.value.requestServerInteraction();
});

// axios
//   .post('/api/data', {
//     params: {
//       page: 1,
//       rowsPerPage: 5,
//       //sortField: '',
//       sortOrder: 'code_id',
//       //filterField: 'name',
//       //filterValue: '',
//     },
//   })
//   .then(res => {
//     codeList.data = res.data;
//     console.log(res.data);
//     //console.table(codeList.data);

//     for (let i = 0; i < 1; i++) {
//       rows2.data = rows2.data.concat(
//         codeList.data.slice(0).map(r => ({ ...r })),
//       );
//     }
//     rows2.data.forEach((row, index) => {
//       row.index = index;
//     });
//   });
///////////////////////////////////////////////////////////////////////
// const param = {
//     codeId: codeId.value,
//     codeValue: codeValue.value,
//     codeName: codeName.value,
//     codeDesc: codeDesc.value,
//     creatId: 'ani',
//   };
//   const idx = 1;
//   axios.post('/api/saveCode/' + idx, { param }).then(res => {
//     console.log(res.data);
//   });

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
