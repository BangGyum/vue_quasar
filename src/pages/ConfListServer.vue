<template>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-header-table"
      flat
      bordered
      ref="tableRef"
      title="Treats"
      :rows="rows.data"
      :columns="columns"
      row-key="CODE_ID"
      v-model:pagination="pagination"
      v-model:selected="selected"
      selection="single"
      :loading="loading"
      :filter="filterValue"
      binary-state-sort
      @request="onRequest"
    >
      <template v-slot:top-right>
        <q-select
          v-model="selectValue"
          :options="options"
          label="Standard"
          style="width: 200px"
        />
        <q-btn color="secondary" label="Update" @click="moveConfUpdate" />
        <q-btn
          style="background: #ff0080; color: white"
          label="Delete"
          @click="deleteClick"
        />
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filterValue"
          placeholder="  Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
  <div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div>

  <q-btn to="/confUpdate" label="To Docs index" outline color="purple" />
  <!--삭제팝업-->
  <q-dialog v-model="confirm" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <span class="text-h6">{{ deleteMessage }}</span>
      </q-card-section>

      <q-card-actions align="left">
        <q-btn flat label="Yes baby" color="primary" v-close-popup />
        <q-btn flat label="NO" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import axios from 'axios';
import { reactive, ref, computed, nextTick, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useCodeStore } from 'stores/codeStore';
import { useRouter } from 'vue-router';

const codeStore = useCodeStore();
const router = useRouter();

const selectValue = ref('');

const confirm = ref(false);
const deleteMessage = '해당 데이터를 삭제 하시겠습니까?';

const selected = ref([]);

const tableRef = ref();
const filterValue = ref('');
const options = reactive([
  'CODE_ID',
  'CODE_VALUE',
  'CODE_NAME',
  'Apple',
  'Oracle',
]);
const loading = ref(false);
const pagination = ref({
  sortBy: 'CODE_ID',
  descending: 'false',
  page: 1,
  rowsPerPage: 3,
  rowsNumber: 10,
});

const model = ref(null);

const rows = reactive({
  //table에 직접 들어갈
  data: [],
});

function moveConfUpdate() {
  console.log(selected.value[0]);
  codeStore.$patch({
    codeId: selected.value[0].CODE_ID,
    codeName: selected.value[0].CODE_NAME,
    codeValue: selected.value[0].CODE_VALUE,
    codeDesc: selected.value[0].CODE_DESC,
  });
  router.push('/confUpdate');
}
let descendingFinal = '';
//페이징
async function fetchFromServer(
  startRow,
  rowsPerPage,
  onSelectValue,
  onFilterValue,
  sortBy,
  descending,
) {
  if (descending === true) {
    descendingFinal = 'desc';
  } else {
    descendingFinal = 'asc';
  }
  console.log('-----------fetchFromServer');
  console.log('sortBy:' + sortBy);
  console.log('descending :' + descending);
  console.log('filterName(onSelectValue) :' + onSelectValue);
  console.log('filterValue(onFilterValue) :' + onFilterValue);
  console.log('descendingFinal:' + descendingFinal);
  console.log('/////-------fetchFromServer');
  try {
    const response = await axios.post('/api/data', {
      params: {
        page: 0,
        startRow: startRow,
        rowsPerPage: rowsPerPage,
        sortBy: sortBy,
        descendingFinal: descendingFinal,
        filterName: onSelectValue,
        filterValue: onFilterValue,
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

pagination.value.rowsNumber = getRowsNumberCount('필터컬럼명', '필터데이터');

async function getRowsNumberCount(filterName, filterValue) {
  try {
    const response = await axios.get('/api/getConfigCount', {
      params: {
        filterName: filterName,
        filterValue: filterValue,
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

function deleteClick() {
  confirm.value = true;
}
function deleteOperation() {
  const param = {
    codeId: codeId.value,
    codeValue: codeValue.value,
    updateId: 'aniUpdate',
  };

  axios.post('/api/deleteCode', { param }).then(res => {
    console.log(res.data);
    if (res.data === '성공') {
      dialogValue.value = '성공';
      alert.value = true;
    } else {
      console.log('실패');
    }
  });
}

async function onRequest(props) {
  console.log('--------------------진입');
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  const onSelectValue = selectValue.value;
  const onFilterValue = filterValue.value;
  console.log('-----------onRequest');
  console.log('page:' + page);
  console.log('sortBy :' + sortBy);
  console.log('selectValue(filterName):' + selectValue.value);
  console.log('filterValue:' + onFilterValue);
  console.log('/////-------onRequest');

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
      onSelectValue,
      onFilterValue,
      sortBy,
      descending,
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

console.log(columns.name);
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
