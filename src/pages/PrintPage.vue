<template>
  <q-page
    class="flex flex-center"
    style="flex-direction: column; justify-content: center; height: 100%"
  >
    <div style="width: 400px; height: 100px"></div>
    <!-- 빈 공간 추가 -->
    <q-btn
      label="배합비 보고서"
      style="width: 400px; height: 100px; margin-bottom: 10px"
      @click="FormulaExcel"
    />
    <q-btn
      label="원가비용 보고서"
      style="width: 400px; height: 100px; margin-bottom: 10px"
    />
    <q-btn label="원료사용 보고서" style="width: 400px; height: 100px" />
    <div style="width: 400px; height: 100px"></div>
    <!-- 빈 공간 추가 -->
  </q-page>
</template>

<script setup>
import _ from 'lodash';
import { ref, shallowRef, reactive, onMounted } from 'vue';
import apiPrint from 'src/api/print';
import { saveAs } from 'file-saver';
import Excel from 'exceljs';
//import { useWorkStore } from "stores/work-stores";

const FormulaExcel = async () => {
  const params = { wrkCode: 'W202402030000005', feedCode: '200210' };
  const prtFeed = await apiPrint.getPrtFeed({ params });
  const mtrl = await apiPrint.getMtrlList({ params });
  const ntr = await apiPrint.getNtrList({ params });
  console.log(prtFeed);
  console.log(mtrl);
  console.log(ntr);

  const headerWidths = Array(18).fill(16); // 각 컬럼의 너비를 동일하게 설정
  const secondHeaderWidths = Array(18).fill(16); // 각 컬럼의 너비를 동일하게 설정

  // workbook 생성
  const wb = new Excel.Workbook();
  // sheet 생성
  const sheet = wb.addWorksheet('behapbi bogoseo');

  sheet.addRow([
    '',
    '',
    '',
    '',
    '',
    '', //g
    '',
    'Formula Table', //I
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  sheet.addRow([]);

  const titleNext2Row = sheet.addRow([
    `CODE Feed : (${prtFeed[0].FEED_CODE}) ${prtFeed[0].FEED_NAME} `,
    '',
    '',
    '',
    '',
    '',
    '', //G
    '',
    `RAW COST : ${prtFeed[0].TTL_PRC}`, //I
    '',
    '',
    '',
    '', //M
    '',
    '',
    '', //P
    `Date : ${prtFeed[0].FRS_RGS_DT}`, //Q
    '', //R
  ]);
  sheet.addRow([]);
  // 제목 셀 병합
  // sheet.mergeCells("A1:B2");
  sheet.mergeCells('H1:K2');

  sheet.mergeCells('A3:B3');
  sheet.mergeCells('I3:J3');
  sheet.mergeCells('Q3:R3');
  //sheet.mergeCells("A3:B4");

  // // 제목 스타일 지정 (선택사항)
  // titleRow.getCell(1).font = { name: "Arial", size: 16, bold: true }; //이 줄은 제목 셀의 글꼴 스타일을 지정. 글꼴 이름을 "Arial"로, 글꼴 크기를 16으로, 그리고 볼드체로 설정
  // titleRow.getCell(1).alignment = { vertical: "middle", horizontal: "center" }; //이 줄은 제목 셀의 정렬 방식을 지정. 수직 방향으로는 중앙에, 수평 방향으로는 가운데에 정렬하도록 설정.

  let cellH1 = sheet.getCell('H1');
  cellH1.font = { name: 'Arial', size: 18, bold: true };
  cellH1.alignment = { vertical: 'middle', horizontal: 'center' };

  let cellA3 = sheet.getCell('A3');
  cellA3.font = { name: 'Arial', size: 9, bold: true };
  cellA3.alignment = { vertical: 'middle', horizontal: 'center' };

  let cellI3 = sheet.getCell('I3');
  cellI3.font = { name: 'Arial', size: 9, bold: true };
  cellI3.alignment = { vertical: 'middle', horizontal: 'center' };

  let cellQ3 = sheet.getCell('Q3');
  cellQ3.font = { name: 'Arial', size: 9, bold: true };
  cellQ3.alignment = { vertical: 'middle', horizontal: 'center' };

  // 상단 헤더(TH) 추가
  const headerRow = sheet.addRow(Object.keys(mtrl[0]));
  // 헤더의 높이값 지정
  headerRow.height = 30.75;
  // 각 헤더 cell에 스타일 지정
  headerRow.eachCell((cell, colNum) => {
    styleHeaderCell(cell);
    sheet.getColumn(colNum).width = headerWidths[colNum - 1];
  });

  // 각 Data cell에 데이터 삽입 및 스타일 지정
  mtrl.forEach(
    ({
      MTRL_CODE,
      WRK_CODE,
      FEED_CODE,
      MTRL_NAME,
      MXR_RT,
      PRC,
      STAT,
      LWR_LMTR,
      UPER_LMTR,
      MTRL_COST,
      CALC_MIN_VAL,
      CALC_MAX_VAL,
      UNT_PRC,
      SRT_ORD,
      FRS_RGS_DT,
      FRS_RGS_ID,
    }) => {
      const rowDatas = [
        MTRL_CODE,
        WRK_CODE,
        FEED_CODE,
        MTRL_NAME,
        MXR_RT,
        PRC,
        STAT,
        LWR_LMTR,
        UPER_LMTR,
        MTRL_COST,
        CALC_MIN_VAL,
        CALC_MAX_VAL,
        UNT_PRC,
        SRT_ORD,
        FRS_RGS_DT,
        FRS_RGS_ID,
      ];
      const appendRow = sheet.addRow(rowDatas);

      appendRow.eachCell((cell, colNum) => {
        styleDataCell(cell, colNum);
        if (colNum === 1) {
          cell.font = {
            color: { argb: 'ff1890ff' },
          };
        }
        if (colNum === 3) {
          cell.numFmt = '0,000';
        }
      });
    },
  );

  // 빈 행 추가
  sheet.addRow([]);

  // 두 번째 테이블의 첫 행을 헤더로 추가
  const secondHeaderRow = sheet.addRow(Object.keys(ntr[0]));
  secondHeaderRow.eachCell((cell, colNum) => {
    styleHeaderCell(cell);
    sheet.getColumn(colNum).width = secondHeaderWidths[colNum - 1]; // 두 번째 테이블의 헤더 너비 설정
  });

  ntr.forEach(
    ({
      NTR_SEQ,
      WRK_CODE,
      FEED_CODE,
      UNT_CD,
      UNT_NAME,
      LVL,
      STAT,
      LWR_LMTR,
      UPER_LMTR,
      CALC_MIN_VAL,
      CALC_MAX_VAL,
      UNT_PRC,
      SRT_ORD,
      FRS_RGS_DT,
      FRS_RGS_ID,
    }) => {
      const rowDatas = [
        NTR_SEQ,
        WRK_CODE,
        FEED_CODE,
        UNT_CD,
        UNT_NAME,
        LVL,
        STAT,
        LWR_LMTR,
        UPER_LMTR,
        CALC_MIN_VAL,
        CALC_MAX_VAL,
        UNT_PRC,
        SRT_ORD,
        FRS_RGS_DT,
        FRS_RGS_ID,
      ];
      const appendRow = sheet.addRow(rowDatas);

      appendRow.eachCell((cell, colNum) => {
        styleDataCell(cell, colNum);
        if (colNum === 1) {
          cell.font = {
            color: { argb: 'ff1890ff' },
          };
        }
        if (colNum === 3) {
          cell.numFmt = '0,000';
        }
      });
    },
  );

  // 파일 생성
  const fileData = await wb.xlsx.writeBuffer(); //writeBuffer는 프로미스를 반환하므로 async-await을 사용해야 한다.
  const blob = new Blob([fileData], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `배합비 보고서`);
};

const styleHeaderCell = cell => {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'ffebebeb' },
  };
  // cell.border = {
  //   bottom: { style: "thin", color: { argb: "-100000f" } },
  //   right: { style: "thin", color: { argb: "-100000f" } },
  // };
  cell.font = {
    name: 'Arial',
    size: 10,
    bold: true,
    color: { argb: 'ff252525' },
  };
  cell.alignment = {
    vertical: 'middle',
    horizontal: 'center',
    wrapText: true,
  };
};

const styleDataCell = cell => {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'ffffffff' },
  };
  // cell.border = {
  //   bottom: { style: "thin", color: { argb: "-100000f" } },
  //   right: { style: "thin", color: { argb: "-100000f" } },
  // };
  cell.font = {
    name: 'Arial',
    size: 9,
    color: { argb: 'ff252525' },
  };
  cell.alignment = {
    vertical: 'middle',
    horizontal: 'center',
    wrapText: true,
  };
};
</script>

<style lang="scss"></style>
