<template>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-header-table"
      flat
      bordered
      ref="tableRef"
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
  <q-btn round dense flat icon="send" @click="capture" />
  <q-btn round dense flat icon="send" @click="createPdf" />
  <q-btn round dense flat icon="send" @click="createPdfmake" />
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

  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card">
      <q-card-section>
        {{ lorem }}
      </q-card-section>
    </q-card>
  </div>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card">
      <q-card-section>
        {{ lorem }}
      </q-card-section>
    </q-card>
  </div>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card">
      <q-card-section>
        {{ lorem }}
      </q-card-section>
    </q-card>
  </div>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card">
      <q-card-section>
        {{ lorem }}
      </q-card-section>
    </q-card>
  </div>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card">
      <q-card-section>
        {{ lorem }}
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import axios from 'axios';
import { reactive, ref, computed, nextTick, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useCodeStore } from 'stores/codeStore';
import { useRouter } from 'vue-router';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
const doc = new jsPDF({
  orientation: 'p',
  unit: 'mm',
  format: 'a4',
});

import html2canvas from 'html2canvas'; //화면캡쳐
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

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
const options = ref([
  //select 옵션, db에서 긁어야함
  'CODE_ID',
  'CODE_VALUE',
  'CODE_NAME',
]);
const loading = ref(false);
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

  try {
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
  } catch (error) {
    console.error(error);
  } finally {
    console.log('finally');
  }
}

onMounted(() => {
  tableRef.value.requestServerInteraction();
});

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
function capture() {
  html2canvas(document.body).then(canvas => {
    // 캔버스를 이미지로 변환
    console.log(canvas);
    const imgData = canvas.toDataURL('image/png'); // 캔버스를 이미지로 변환합니다. 이미지 형식은 PNG입니다.

    // const imgWidth = 210; // 가로(mm) (A4)
    // const pageHeight = imgWidth * 1.414; // 세로 길이 (A4)
    // const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgWidth = 210; // 가로(mm) (A4)
    const pageHeight = 210; //* 1.414; // 세로 길이 (A4)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });

    let heightLeft = imgHeight; //이미지가 여러 페이지일때, 각 페이지에서 이미지의 어디를 출력해야하는지
    let position = 0; //이미지가 출력될 y 좌표

    // 첫 페이지 출력
    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 한 페이지 이상일 경우 루프 돌면서 출력
    while (heightLeft >= 20) {
      // 남아있는 이미지 높이가 20mm 이상인 경우, 새 페이지를 추가하고 이미지를 계속 출력합니다.
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    doc.save('capture.pdf');
  });
}

function createPdf() {
  const doc = new jsPDF('landscape'); //  jsPDF는 기본적으로 좌표 체계를 포인트(pt)로 설정하므로, 1mm는 약 2.83pt입니다. 따라서 A4 크기의 문서에서 x 축의 범위는 대략 0에서 595pt입니다.  x 축의 범위는 0에서 210mm가 됩니다.
  // 가운데 중앙에 제목 추가
  doc.setFontSize(20);
  doc.text('title', 150, 20, { align: 'center' }); //이라는 텍스트를 x 좌표 105, y 좌표 20의 위치에 가운데 정렬로 추가합니다.

  // 왼쪽 중앙에 데이터 추가
  doc.setFontSize(12);
  doc.text('left', 20, 40);

  // 오른쪽 중앙에 데이터 추가
  doc.text('right', 270, 40);

  // 테이블 추가
  doc.autoTable({
    startY: 50,
    head: [
      [
        {
          content: 'Name',
          styles: {
            halign: 'right',
            cellWidth: 140,
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
          },
        },
        {
          content: 'Email',
          styles: {
            halign: 'right',
            cellWidth: 140,
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
          },
        },
        {
          content: 'Country',
          styles: {
            halign: 'right',
            cellWidth: 140,
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
          },
        },
      ],
    ],
    body: [
      [
        'David',
        'david@example.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm',
        'England',
      ],
      ['John', 'john@example.com', 'USA'],
      ['Jane', 'jane@example.com', 'France'],
      ['David', 'david@example.com', 'England'],
      ['John', 'john@example.com', 'USA'],
      ['Jane', 'jane@example.com', 'France'],
      ['David', 'david@example.com', 'England'],
      ['John', 'john@example.com', 'USA'],
      ['Jane', 'jane@example.com', 'France'],
      ['David', 'david@example.com', 'England'],
    ],

    styles: { fontSize: 10 },
  });

  // 두 번째 테이블 추가
  doc.autoTable({
    startY: doc.previousAutoTable.finalY + 20, // 이전 테이블 다음에 테이블을 추가
    head: [['Name', 'Email', 'Country']],
    body: [
      ['David', 'david@example.com', 'England'],
      ['John', 'john@example.com', 'USA'],
      ['Jane', 'jane@example.com', 'France'],
      ['David', 'david@example.com', 'England'],
      ['John', 'john@example.com', 'USA'],
      ['Jane', 'jane@example.com', 'France'],
      ['David', 'david@example.com', 'England'],
      ['John', 'john@example.com', 'USA'],
      ['Jane', 'jane@example.com', 'France'],
    ],
    columnStyles: {
      Name: { cellWidth: 20 }, // 'Email' 컬럼의 너비를 50으로 설정
    },
  });

  // 맨 아래에 페이지 번호 추가
  const pageCount = doc.getNumberOfPages(); // 총 페이지 수
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(' ' + String(i) + ' / ' + String(pageCount), 155, 200, {
      align: 'center',
    });
  }

  doc.save('table.pdf');
}
function createPdfmake() {
  //pdfmake
  const docDefinition = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    content: [
      {
        text: '\n\n\n', // 여기서 \n의 개수를 조절하여 테이블의 시작 위치를 조절
      },
      {
        text: 'title',
        alignment: 'center',
        fontSize: 25,
        margin: [0, 20, 0, 40],
      },
      {
        columns: [
          { text: 'left', alignment: 'left', fontSize: 15 },
          { text: 'right', alignment: 'right', fontSize: 15 },
        ],
      },
      {
        table: {
          widths: [130, 130, 130],
          body: [
            [
              {
                text: 'Name',
                alignment: 'right',
                fillColor: 'gray',
                color: 'white',
              },
              {
                text: 'Email',
                alignment: 'right',
                fillColor: 'gray',
                color: 'white',
              },
              {
                text: 'Country',
                alignment: 'right',
                fillColor: 'gray',
                color: 'white',
              },
            ],
            [
              'David',
              'david@example.com,mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm',
              'England',
            ],
            ['John', 'john@example.com', 'USA'],
            ['Jane', 'jane@example.com', 'France'],
            ['David', 'david@example.com', 'England'],
            ['John', 'john@example.com', 'USA'],
            ['Jane', 'jane@example.com', 'France'],
            ['David', 'david@example.com', 'England'],
            ['John', 'john@example.com', 'USA'],
            ['Jane', 'jane@example.com', 'France'],
            ['David', 'david@example.com', 'England'],
            ['John', 'john@example.com', 'USA'],
            ['Jane', 'jane@example.com', 'France'],
          ],
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 0 : 0.3; //가로선 굵기
          },
          vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 0 : 0.3; //세로선 굵기
          },
        },
        margin: [0, 0, 0, 20], // optional
      },
      { text: '', pageBreak: 'before' },
      {
        table: {
          widths: [20, '*', '*'],
          body: [
            [{ text: 'Name', style: 'myCustomStyle' }, 'Email', 'Country'],
            [
              { text: 'DavidKun', style: 'myCustomStyle' },
              'david@example.com',
              'England',
            ],
            ['John', 'john@example.com', 'USA'],
            ['Jane', 'jane@example.com', 'France'],
            ['David', 'david@example.com', 'England'],
            ['John', 'john@example.com', 'USA'],
            ['Jane', 'jane@example.com', 'France'],
            ['David', 'david@example.com', 'England'],
            ['John', 'john@example.com', 'USA'],
            ['Jane', 'jane@example.com', 'France'],

            ['David', 'david@example.com', 'England'],
            ['John', 'john@example.com', 'USA'],
            ['Jane', 'jane@example.com', 'France'],
            ['David', 'david@example.com', 'England'],
            ['John', 'john@example.com', 'USA'],
            ['Jane', 'jane@example.com', 'France'],
            ['David', 'david@example.com', 'England'],
            ['John', 'john@example.com', 'USA'],
            ['Jane', 'jane@example.com', 'France'],
            ['David', 'david@example.com', 'England'],
            ['John', 'john@example.com', 'USA'],
            ['Jane', 'jane@example.com', 'France'],
            ['David', 'david@example.com', 'England'],
            ['John', 'john@example.com', 'USA'],
            ['Jane', 'jane@example.com', 'France'],
          ],
        },
        layout: 'lightHorizontalLines', // optional
      },
    ],
    styles: {
      myCustomStyle: {
        fontSize: 8,
      },
    },
    footer: function (currentPage, pageCount) {
      return {
        text: ` ${currentPage} / ${pageCount}`,
        alignment: 'center',
      };
    },
  };

  pdfMake.createPdf(docDefinition).download('table.pdf');
}

const seed = reactive({
  //table에 직접 들어갈
  data: [
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
  ],
});
//위 seed.data 안에 있는 데이터를 pdfmake로 그대로 뽑아내려고 하는데, 저기 데이터마다 style을 지정하고 싶으면 어떻게 가공하지?
console.log(seed.data);
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

  .my-card
    width: 100%
    max-width: 250px
</style>
