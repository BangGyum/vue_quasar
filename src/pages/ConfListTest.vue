<template>
  <q-table :rows="rows" :columns="columns" />
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Alert" color="primary" @click="aaa" />
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, reactive } from 'vue';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const rows = ref([
  { name: 'Apple', isUsed: true },
  { name: 'Banana', isUsed: false },
  { name: 'Cherry', isUsed: true },
]);

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Fruit',
    field: 'name',
    align: 'left',
  },
  {
    name: 'isUsed',
    required: true,
    label: 'Used',
    field: 'isUsed',
    align: 'center',
    format: val => (val ? 'Yes' : 'No'),
  },
];

function aaa() {
  /* documentDefinition : pdf파일에 들어갈 내용 및 여러가지를 정의 */
  var documentDefinition = {
    //content : pdf의 내용을 정의
    content: [
      {
        text: 'First paragraph',
      }, // 스타일 적용 없이 그냥 출력
      {
        text: 'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines',
        bold: true,
      }, // 텍스트에 bold 주기
      {
        text: '가나다라마바사아자타카타파하',
        style: 'style_test',
      }, // style 부분에 정의된 style_test 적용해보기 및 한글 꺠짐 테스트
      {
        style: 'tableExample',
        table: {
          widths: [100, '*', 200, '*'],
          body: [
            ['width=100', 'star-sized', 'width=200', 'star-sized'],
            [
              'fixed-width cells have exactly the specified width',
              {
                text: 'nothing interesting here',
                italics: true,
                color: 'gray',
              },
              {
                text: 'nothing interesting here',
                italics: true,
                color: 'gray',
              },
              {
                text: 'nothing interesting here',
                italics: true,
                color: 'gray',
              },
            ],
          ],
        },
      }, //테이블 그리기
    ],
    //하단의 현재페이지 / 페이지 수 넣기
    footer: function (currentPage, pageCount) {
      return {
        margin: 10,
        columns: [
          {
            fontSize: 9,
            text: [
              {
                text:
                  '--------------------------------------------------------------------------' +
                  '\n',
                margin: [0, 20],
              },
              {
                text: '' + currentPage.toString() + ' of ' + pageCount,
              },
            ],
            alignment: 'center',
          },
        ],
      };
    },
    //필요한 스타일 정의하기
    styles: {
      style_test: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 0],
        alignment: 'center',
      },
      tableExample: {
        margin: [0, 5, 0, 15],
      },
    },

    // 페이지 크기 용지의 크기 사이즈 넣기 또는 특정 사이즈 넣기 { width: number, height: number }
    pageSize: 'A4',

    /* 페이지 방향 portrait : 가로 , landscape : 세로 */
    pageOrientation: 'portrait',
  };

  var pdf_name = 'pdf파일 만들기.pdf'; // pdf 만들 파일의 이름
  pdfMake.createPdf(documentDefinition).download(pdf_name);
}
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
