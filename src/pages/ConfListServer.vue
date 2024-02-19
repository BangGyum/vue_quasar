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
      <template v-slot:body-cell-isDel="props">
        <q-td :props="props">
          <q-toggle
            v-model="props.row.isDel"
            color="green"
            checked-icon="check"
            unchecked-icon="clear"
            @update:modelValue="toggleChanged(props.row)"
            @click="clickE(props.row.isDel)"
          />
        </q-td>
      </template>
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
        <q-btn
          flat
          label="Yes baby"
          color="primary"
          v-close-popup
          @click="deleteOperation()"
        />
        <q-btn flat label="NO" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
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
</template>

<script setup>
import axios from 'axios';
import { reactive, ref, computed, nextTick, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useCodeStore } from 'stores/codeStore';
import { useRouter } from 'vue-router';

const isSubmitting = ref(false); // 요청을 보내는 동안 true로 설정

//const watchIsDel = ref(props.row.isDel === 'true');

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
  //console.log(selected.value[0]);
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
  // console.log('sortBy:' + sortBy);
  // console.log('descending :' + descending);
  // console.log('filterName(onSelectValue) :' + onSelectValue);
  // console.log('filterValue(onFilterValue) :' + onFilterValue);
  // console.log('descendingFinal:' + descendingFinal);
  // console.log('/////-------fetchFromServer');
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
    for (let index in response.data) {
      console.log(response.data[index]);
      const row = response.data[index];
      if (row.DEL_YN === 'N') {
        response.data[index].isDel = false;
      } else {
        response.data[index].isDel = true;
      }
    }
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
  if (isSubmitting.value === false) {
    const param = {
      codeId: selected.value[0].CODE_ID,
      codeValue: selected.value[0].CODE_VALUE,
      updateId: 'aniDelete',
    };
    submit();

    const submit = async () => {
      isSubmitting.value = true;

      try {
        const res = await axios.post('/api/delYnChange', { param });

        if (res.data === '성공') {
          console.log('변경 성공');
        } else {
          console.log('실패');
        }
      } catch (err) {
        console.error(err);
      } finally {
        isSubmitting.value = false;
      }
    };
  } else {
    console.log('isSubmitting.value === true');
  }
}

async function onRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  const onSelectValue = selectValue.value;
  const onFilterValue = filterValue.value;
  console.log('-----------onRequest');
  // console.log('page:' + page);
  // console.log('sortBy :' + sortBy);
  // console.log('selectValue(filterName):' + selectValue.value);
  // console.log('filterValue:' + onFilterValue);
  // console.log('/////-------onRequest');

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

function toggleChanged(row) {
  //  row.DEL_YN = 'AAA';
  row.DEL_YN = row.isDel ? 'Y' : 'N';
  console.log(row.CODE_ID);
  console.log(row.isDel);
  console.log(row.DEL_YN);
  // 여기에서 row.DEL_YN 값이 변경되었을 때의 처리를 작성합니다.
  // 예를 들어, 서버에 업데이트를 요청하는 등의 코드를 작성할 수 있습니다.
  const param = {
    codeId: row.CODE_ID,
    codeValue: row.CODE_VALUE,
    delYn: row.DEL_YN,
    updateId: 'aniDelete',
  };

  axios.post('/api/delYnChange', { param }).then(res => {
    //console.log(res.data);
    if (res.data === '성공') {
      //dialogValue.value = '성공';
      //alert.value = true;
      console.log('변경 성공');
    } else {
      console.log('실패');
    }
  });
}

function clickE(a) {
  console.log('-----clickE');
  console.log(a);
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
  {
    name: 'isDel',
    label: 'isDel',
    field: 'isDel',
    align: 'center',
    //format: val => (val === 'Y' ? 'true' : 'false'),
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
