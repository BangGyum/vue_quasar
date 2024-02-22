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
          />
        </q-td>
      </template>

      <template v-slot:bottom-left> </template>

      <template v-slot:top-right>
        <q-select
          v-model="selectValue"
          :options="options"
          label="Standard"
          style="width: 200px"
        />
        <q-btn color="secondary" label="Update" @click="updateBtnClick" />
        <q-btn
          style="background: #ff0080; color: white"
          label="Delete"
          @click="deleteBtnClick"
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

  <div class="q-pa-lg flex flex-center">
    {{ pagination.rowsNumber / pagination.rowsPerPage }}
    <q-pagination
      v-model="pagination.page"
      :max="
        pagination.rowsPerPage
          ? Math.ceil(pagination.rowsNumber / pagination.rowsPerPage)
          : 0
      "
      direction-links
      @update:modelValue="pageNumClick"
    />
  </div>
  <q-btn @click="addRow">Add row</q-btn>
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
const router = useRouter();

const showAlert = ref(false);

const isSubmitting = ref(false); // 요청을 보내는 동안 true로 설정

const codeStore = useCodeStore();

const selectValue = ref(''); //select 보이는 곳 변수

const selected = ref([]); //select 목록

const confirm = ref(false); //삭제팝업 true = 팝업표출
const deleteMessage = '해당 데이터를 삭제 하시겠습니까?';

const tableRef = ref();
const filterValue = ref('');

const loading = ref(false); //로딩 모션
const pagination = ref({
  sortBy: 'CODE_ID',
  descending: 'false',
  page: 1,
  rowsPerPage: 3,
  rowsNumber: 10,
});

pagination.value.rowsNumber = getRowsNumberCount('필터컬럼명', '필터데이터');

const model = ref(null);

const rows = reactive({
  //table에 직접 들어갈
  data: [],
});

async function onRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  const onSelectValue = selectValue.value;
  const onFilterValue = filterValue.value;
  console.log('-----------onRequest');
  console.log('rowsPerPage: ' + rowsPerPage);
  // console.log('page:' + page);
  // console.log('sortBy :' + sortBy);
  // console.log('selectValue(filterName):' + selectValue.value);
  // console.log('filterValue:' + onFilterValue);
  // console.log('/////-------onRequest');

  loading.value = true;
  const fetchCount =
    rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;
  const startRow = (page - 1) * rowsPerPage;

  console.log('fetchCount: ' + fetchCount);

  try {
    pagination.value.rowsNumber = await getRowsNumberCount(
      startRow,
      fetchCount,
      onSelectValue,
      onFilterValue,
      sortBy,
      descending,
    );

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
async function getRowsNumberCount(filterName, filterValue) {
  //  startRow,
  // rowsPerPage,
  // onSelectValue,
  // onFilterValue,
  // sortBy,
  // descending,
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

function updateBtnClick() {
  //console.log(selected.value[0]);
  codeStore.$patch({
    codeId: selected.value[0].CODE_ID,
    codeName: selected.value[0].CODE_NAME,
    codeValue: selected.value[0].CODE_VALUE,
    codeDesc: selected.value[0].CODE_DESC,
  });
  router.push('/confUpdate');
}

function deleteBtnClick() {
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

async function pageNumClick(newPage) {
  console.log(pagination.value);
  const { rowsPerPage, sortBy, descending } = pagination.value;
  const onSelectValue = selectValue.value;
  const onFilterValue = filterValue.value;
  console.log('-----------onRequest');
  console.log('rowsPerPage: ' + rowsPerPage);

  loading.value = true;
  const fetchCount =
    rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;
  const startRow = (newPage - 1) * rowsPerPage;

  console.log('fetchCount: ' + fetchCount);

  try {
    pagination.value.rowsNumber = await getRowsNumberCount(
      startRow,
      fetchCount,
      onSelectValue,
      onFilterValue,
      sortBy,
      descending,
    );

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

    pagination.value.page = newPage;
    pagination.value.rowsPerPage = rowsPerPage;
    pagination.value.sortBy = sortBy;
    pagination.value.descending = descending;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}
async function toggleChanged(row) {
  row.DEL_YN = row.isDel ? 'Y' : 'N';

  const param = {
    codeId: row.CODE_ID,
    codeValue: row.CODE_VALUE,
    delYn: row.DEL_YN,
    updateId: 'aniDelete',
  };
  try {
    //
    const res = await axios.post('/api/delYnChange', { param }); // await 키워드 추가
    if (res.data === '성공') {
      console.log('변경 성공');
    } else {
      console.log('실패');
    }
  } catch (error) {
    if (error.response.status === 500) {
      console.log('500 Error');
      if (row.DEL_YN === 'Y') {
        row.DEL_YN = 'N';
      } else {
        row.DEL_YN = 'Y';
      }
    }
  } finally {
    console.log('finally');
  }
}

onMounted(() => {
  //DOM에 마운트 된 직후 호출
  tableRef.value.requestServerInteraction(); //Qtable의 서버모드 작동, request와 관련있는것으로 추측.
});

function addRow() {
  //새 데이터 추가
  const newRow = {
    RowNum: '',
    CODE_ID: '',
    CODE_VALUE: '',
    CODE_NAME: '',
    CODE_DESC: '',
    DEL_YN: '',
    CREATE_DT: '',
    UPDATE_DT: '',
    CREATE_ID: '',
    UPDATE_ID: '',
    isDel: true,
  }; // 새 행 데이터
  console.log(rows.data);
  rows.data.unshift(newRow); // 새 행을 맨 위에 추가
  //pagination.value.rowsNumber++; // 총 행 수 증가
}

function alert() {
  $q.dialog({
    dark: true,
    title: 'Alert',
    message: 'Some message',
  })
    .onOk(() => {
      // console.log('OK')
    })
    .onCancel(() => {
      // console.log('Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
}

const columns = [
  {
    name: 'RowNum',
    label: 'RowNum',
    field: 'RowNum',
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

const options = ref(
  //select 옵션, db에서 긁어야함
  columns
    .filter(columns => columns.name !== 'RowNum' && columns.name !== 'isDel')
    .map(columns => columns.name),
);
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
