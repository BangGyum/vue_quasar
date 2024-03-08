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
      @click="RawCostExcel"
    />
    <q-btn label="원료사용 보고서" style="width: 400px; height: 100px" />
    <div style="width: 400px; height: 100px"></div>
    <!-- 빈 공간 추가 -->
  </q-page>
</template>

<script setup>
import _ from 'lodash';
import { ref, shallowRef, reactive, onMounted } from 'vue';
//import apiPrint from 'src/api/print';
import { saveAs } from 'file-saver';
import Excel from 'exceljs';
//import { useWorkStore } from "stores/work-stores";

const FormulaExcel = async () => {
  //let params = { wrkCode: "W202402030000005", feedCode: "200210" };
  const prtFeed =
    //= await apiPrint.getPrtFeed({ params });
    [
      {
        FEED_CODE: '100200',
        FEED_NAME: '송아지',
        TTL_PRC: 312.98,
        MXR_CPC: 125,
        FRS_RGS_DT: '2024-03-07',
        FRS_RGS_ID: 'admin',
      },
      {
        FEED_CODE: '200210',
        FEED_NAME: '젖뗀돼지',
        TTL_PRC: 323.02,
        MXR_CPC: 235,
        FRS_RGS_DT: '2024-03-07',
        FRS_RGS_ID: 'admin',
      },
      {
        FEED_CODE: '990121',
        FEED_NAME: '살찐돼지',
        TTL_PRC: 643.22,
        MXR_CPC: null,
        FRS_RGS_DT: '2024-03-08',
        FRS_RGS_ID: 'admin',
      },
    ];

  const mtrl = [
    {
      MTRL_CODE: '001000',
      WRK_CODE: 'W202402030000005',
      FEED_CODE: '990121',
      MTRL_NAME: '옥수수',
      MXR_RT: 50.5382,
      PRC: 250,
      STAT: '',
      LWR_LMTR: 0,
      UPER_LMTR: 100,
      MTRL_COST: 126.35,
      CALC_MIN_VAL: 191.22,
      CALC_MAX_VAL: 251,
      UNT_PRC: 0,
      SRT_ORD: 1,
      FRS_RGS_DT: '2024-03-08',
      FRS_RGS_ID: 'admin',
      LST_UPD_DT: null,
      LST_MDF_ID: null,
      undetermined: '?',
    },
    {
      MTRL_CODE: '001050',
      WRK_CODE: 'W202402030000005',
      FEED_CODE: '990121',
      MTRL_NAME: '보리',
      MXR_RT: 0,
      PRC: 700,
      STAT: '',
      LWR_LMTR: 1,
      UPER_LMTR: 70,
      MTRL_COST: 0,
      CALC_MIN_VAL: 633.22,
      CALC_MAX_VAL: 0,
      UNT_PRC: 0,
      SRT_ORD: 3,
      FRS_RGS_DT: '2024-03-08',
      FRS_RGS_ID: 'admin',
      LST_UPD_DT: null,
      LST_MDF_ID: null,
      undetermined: '?',
    },
    {
      MTRL_CODE: '003011',
      WRK_CODE: 'W202402030000005',
      FEED_CODE: '990121',
      MTRL_NAME: '대두박',
      MXR_RT: 21.4618,
      PRC: 450,
      STAT: '',
      LWR_LMTR: 0,
      UPER_LMTR: 100,
      MTRL_COST: 96.58,
      CALC_MIN_VAL: 343.52,
      CALC_MAX_VAL: 464,
      UNT_PRC: 0,
      SRT_ORD: 4,
      FRS_RGS_DT: '2024-03-08',
      FRS_RGS_ID: 'admin',
      LST_UPD_DT: null,
      LST_MDF_ID: null,
      undetermined: '?',
    },
    {
      MTRL_CODE: '003090',
      WRK_CODE: 'W202402030000005',
      FEED_CODE: '990121',
      MTRL_NAME: '소맥피',
      MXR_RT: 34.5322,
      PRC: 322,
      STAT: '',
      LWR_LMTR: 0,
      UPER_LMTR: 43,
      MTRL_COST: 56.41,
      CALC_MIN_VAL: 0,
      CALC_MAX_VAL: 280,
      UNT_PRC: 0,
      SRT_ORD: 6,
      FRS_RGS_DT: '2024-03-08',
      FRS_RGS_ID: 'admin',
      LST_UPD_DT: null,
      LST_MDF_ID: null,
      undetermined: '?',
    },
    {
      MTRL_CODE: '005020',
      WRK_CODE: 'W202402030000005',
      FEED_CODE: '990121',
      MTRL_NAME: '당밀',
      MXR_RT: 4,
      PRC: 500,
      STAT: 'min.',
      LWR_LMTR: 3,
      UPER_LMTR: 6,
      MTRL_COST: 7,
      CALC_MIN_VAL: 432.32,
      CALC_MAX_VAL: 0,
      UNT_PRC: 0.93,
      SRT_ORD: 5,
      FRS_RGS_DT: '2024-03-08',
      FRS_RGS_ID: 'admin',
      LST_UPD_DT: null,
      LST_MDF_ID: null,
      undetermined: '?',
    },
  ];

  const ntr = [
    {
      NTR_SEQ: '45689734',
      WRK_CODE: 'W202402030000005',
      FEED_CODE: '990121',
      UNT_CD: 'Mo',
      UNT_NAME: '(%)',
      LVL: 16.84,
      STAT: '',
      LWR_LMTR: 1,
      UPER_LMTR: 18,
      CALC_MIN_VAL: 2,
      CALC_MAX_VAL: 15,
      UNT_PRC: 5.88,
      SRT_ORD: 1,
      FRS_RGS_DT: '2024-03-08',
      FRS_RGS_ID: 'admin',
      LST_UPD_DT: null,
      LST_MDF_ID: null,
    },
    {
      NTR_SEQ: '45689735',
      WRK_CODE: 'W202402030000005',
      FEED_CODE: '990121',
      UNT_CD: '조단백',
      UNT_NAME: '(%)',
      LVL: 20.93,
      STAT: 'min.',
      LWR_LMTR: 17,
      UPER_LMTR: 32,
      CALC_MIN_VAL: 0,
      CALC_MAX_VAL: 18,
      UNT_PRC: 3.12,
      SRT_ORD: 2,
      FRS_RGS_DT: '2024-03-08',
      FRS_RGS_ID: 'admin',
      LST_UPD_DT: null,
      LST_MDF_ID: null,
    },
    {
      NTR_SEQ: '45689736',
      WRK_CODE: 'W202402030000005',
      FEED_CODE: '990121',
      UNT_CD: '조지아방',
      UNT_NAME: '(%)',
      LVL: 5.93,
      STAT: '',
      LWR_LMTR: 0,
      UPER_LMTR: 54,
      CALC_MIN_VAL: 1,
      CALC_MAX_VAL: 6,
      UNT_PRC: 1.1,
      SRT_ORD: 2,
      FRS_RGS_DT: '2024-03-08',
      FRS_RGS_ID: 'admin',
      LST_UPD_DT: null,
      LST_MDF_ID: null,
    },
  ];

  const secondHeaderWidths = Array(18).fill(16); // 각 컬럼의 너비를 동일하게 설정
  // workbook 생성
  const wb = new Excel.Workbook();

  for (let i = 0; i < prtFeed.length; i++) {
    //params.feedCode = prtFeed[i].FEED_CODE;
    //let mtrl = await apiPrint.getMtrlList({ params });
    //const ntr = await apiPrint.getNtrList({ params });
    mtrl = mtrl.map(item => {
      //현재 배치가 없으므로 임시
      return {
        ...item, // 기존의 속성
        undetermined: '?',
      };
    });
    console.log(mtrl);
    console.log(ntr);

    // sheet 생성
    const sheet = wb.addWorksheet(
      '(' + prtFeed[i].FEED_CODE + ')' + prtFeed[i].FEED_NAME,
    );

    //--------------------헤더부분

    sheet.addRow([
      '',
      '',
      '',
      'Formula Table', //D
      '',
      '', //F
      '',
      '', //H
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
      `RAW COST : ${prtFeed[0].TTL_PRC}`, //E
      '',
      '', //G
      '',
      `Date : ${prtFeed[0].FRS_RGS_DT}`, //I
      '',
      '',
      '',
      '', //M
      '',
      '',
      '', //P
      '', //Q
      '', //R
    ]);
    sheet.addRow([]);
    sheet.mergeCells('D1:G2'); //제목 셀 병합

    sheet.mergeCells('A3:B3'); //왼쪽
    sheet.mergeCells('E3:F3'); //중앙
    sheet.mergeCells('I3:K3'); //오른쪽
    //sheet.mergeCells("A3:B4");

    // // 제목 스타일 지정 (선택사항)
    // titleRow.getCell(1).font = { name: "Arial", size: 16, bold: true }; //이 줄은 제목 셀의 글꼴 스타일을 지정. 글꼴 이름을 "Arial"로, 글꼴 크기를 16으로, 그리고 볼드체로 설정
    // titleRow.getCell(1).alignment = { vertical: "middle", horizontal: "center" }; //이 줄은 제목 셀의 정렬 방식을 지정. 수직 방향으로는 중앙에, 수평 방향으로는 가운데에 정렬하도록 설정.

    let cellD1 = sheet.getCell('D1');
    cellD1.font = { name: 'Arial', size: 18, bold: true };
    cellD1.alignment = { vertical: 'middle', horizontal: 'center' };

    let cellA3 = sheet.getCell('A3');
    cellA3.font = { name: 'Arial', size: 9, bold: true };
    cellA3.alignment = { vertical: 'middle', horizontal: 'center' };

    let cellE3 = sheet.getCell('E3');
    cellE3.font = { name: 'Arial', size: 9, bold: true };
    cellE3.alignment = { vertical: 'middle', horizontal: 'center' };

    let cellJ3 = sheet.getCell('J3');
    cellJ3.font = { name: 'Arial', size: 9, bold: true };
    cellJ3.alignment = { vertical: 'middle', horizontal: 'center' };

    // 빈 행 삽입
    sheet.addRow([]);

    // 두 번째 테이블 헤더 생성
    const firstHeaderRow1 = sheet.getRow(5);
    //firstHeaderRow1.values = Object.keys(ntr[0]);
    firstHeaderRow1.values = [
      'Code',
      'Raw Material',
      'Formula(%)',
      'Price',
      'Status',
      'Bound(%)', //
      '', //
      'Raw Cost',
      'Batch',
      'Value', //
      '', //
      'Unit Cost',
    ];

    const firstHeaderRow2 = sheet.getRow(6); // 두 번째 헤더 행은 첫 번째 헤더 행 바로 다음 행
    firstHeaderRow2.values = [
      '',
      '',
      '',
      '',
      '',
      'Min', //
      'Max', //
      '',
      '(/kg)',
      'Low', //
      'Upper', //
      '',
    ];

    // 첫 번째 열의 첫 번째 헤더 셀과 두 번째 헤더 셀을 병합
    sheet.mergeCells(`A5:A6`);
    sheet.mergeCells(`B5:B6`);
    sheet.mergeCells(`C5:C6`);
    sheet.mergeCells(`D5:D6`);
    sheet.mergeCells(`E5:E6`);
    sheet.mergeCells(`F5:G5`); //가로로
    sheet.mergeCells(`H5:H6`);
    sheet.mergeCells(`J5:K5`);
    sheet.mergeCells(`L5:L6`);

    firstHeaderRow1.eachCell((cell, colNum) => {
      styleHeaderCell(cell);
      sheet.getColumn(colNum).width = secondHeaderWidths[colNum - 1]; // 두 번째 테이블의 헤더 너비 설정
    });
    firstHeaderRow2.eachCell((cell, colNum) => {
      styleHeaderCell(cell);
      sheet.getColumn(colNum).width = secondHeaderWidths[colNum - 1]; // 두 번째 테이블의 헤더 너비 설정
    });

    ///////////////////////////////헤더부분 종료

    // 각 Data cell에 데이터 삽입 및 스타일 지정
    mtrl.forEach(
      ({
        MTRL_CODE,
        //      FEED_CODE,
        MTRL_NAME,
        MXR_RT,
        PRC,
        STAT,
        LWR_LMTR,
        UPER_LMTR,
        MTRL_COST,
        undetermined,
        CALC_MIN_VAL,
        CALC_MAX_VAL,
        UNT_PRC,
      }) => {
        const rowDatas = [
          MTRL_CODE,
          //      FEED_CODE,
          MTRL_NAME,
          MXR_RT,
          PRC,
          STAT,
          LWR_LMTR,
          UPER_LMTR,
          MTRL_COST,
          undetermined,
          CALC_MIN_VAL,
          CALC_MAX_VAL,
          UNT_PRC,
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
            cell.numFmt = '0.0000';
          }
          if (colNum === 4) {
            cell.numFmt = '0.00';
          }
          if (colNum === 6) {
            cell.numFmt = '0.00';
          }
          if (colNum === 7) {
            cell.numFmt = '0.00';
          }
          if (colNum === 8) {
            cell.numFmt = '0.00';
          }
          if (colNum === 9) {
            cell.numFmt = '0.00';
          }
          if (colNum === 10) {
            cell.numFmt = '0.00';
          }
        });
      },
    );

    // 빈 행 추가
    sheet.addRow([]);

    // 첫 번째 테이블의 마지막 행 번호를 저장
    const firstTableEndRowNumber = sheet.lastRow.number;

    // 빈 행 삽입
    sheet.addRow([]);

    // 두 번째 테이블 헤더의 시작 행 번호를 계산
    const secondTableStartRowNumber = firstTableEndRowNumber + 2; // 빈 행을 고려하여 +2

    // 두 번째 테이블 헤더 생성
    const secondHeaderRow1 = sheet.getRow(secondTableStartRowNumber);
    //secondHeaderRow1.values = Object.keys(ntr[0]);
    secondHeaderRow1.values = [
      'Nutrients',
      '',
      'Level',
      'Status',
      'Bound',
      '',
      'Range',
      '',
      'Unit Cost',
    ];

    const secondHeaderRow2 = sheet.getRow(secondTableStartRowNumber + 1); // 두 번째 헤더 행은 첫 번째 헤더 행 바로 다음 행
    secondHeaderRow2.values = [
      '',
      '',
      '',
      '',
      'Min',
      'Max',
      'Low',
      'Upper',
      '',
    ];

    // 첫 번째 열의 첫 번째 헤더 셀과 두 번째 헤더 셀을 병합
    sheet.mergeCells(`A${secondHeaderRow1.number}:B${secondHeaderRow2.number}`);
    sheet.mergeCells(`C${secondHeaderRow1.number}:C${secondHeaderRow2.number}`);
    sheet.mergeCells(`D${secondHeaderRow1.number}:D${secondHeaderRow2.number}`);
    sheet.mergeCells(`E${secondHeaderRow1.number}:F${secondHeaderRow1.number}`);
    sheet.mergeCells(`G${secondHeaderRow1.number}:H${secondHeaderRow1.number}`);
    sheet.mergeCells(`I${secondHeaderRow1.number}:I${secondHeaderRow2.number}`);

    secondHeaderRow1.eachCell((cell, colNum) => {
      styleHeaderCell(cell);
      sheet.getColumn(colNum).width = secondHeaderWidths[colNum - 1]; // 두 번째 테이블의 헤더 너비 설정
    });
    secondHeaderRow2.eachCell((cell, colNum) => {
      styleHeaderCell(cell);
      sheet.getColumn(colNum).width = secondHeaderWidths[colNum - 1]; // 두 번째 테이블의 헤더 너비 설정
    });

    ntr.forEach(
      ({
        UNT_CD,
        UNT_NAME,
        LVL,
        STAT,
        LWR_LMTR,
        UPER_LMTR,
        CALC_MIN_VAL,
        CALC_MAX_VAL,
        UNT_PRC,
      }) => {
        const rowDatas = [
          UNT_CD,
          UNT_NAME,
          LVL,
          STAT,
          LWR_LMTR,
          UPER_LMTR,
          CALC_MIN_VAL,
          CALC_MAX_VAL,
          UNT_PRC,
        ];
        console.log('rowDatas');
        console.log(rowDatas);
        const appendRow = sheet.addRow(rowDatas);

        appendRow.eachCell((cell, colNum) => {
          styleDataCell(cell, colNum);
          if (colNum === 1) {
            cell.font = {
              color: { argb: 'ff1890ff' },
            };
          }
          if (colNum === 3) {
            cell.numFmt = '0.0000';
          }
          if (colNum === 5) {
            cell.numFmt = '0.0000';
          }
          if (colNum === 6) {
            //bound Max
            cell.numFmt = '0.0000';
          }
          if (colNum === 7) {
            cell.numFmt = '0.00';
          }
          if (colNum === 8) {
            cell.numFmt = '0.00';
          }
          if (colNum === 9) {
            cell.numFmt = '0.00';
          }
        });
      },
    );
    // const lastRow = worksheet.rowCount;
    // console.log(lastRow);
  }
  // let mtrl = await apiPrint.getMtrlList({ params });
  // const ntr = await apiPrint.getNtrList({ params });

  // 파일 생성
  const fileData = await wb.xlsx.writeBuffer(); //writeBuffer는 프로미스를 반환하므로 async-await을 사용해야 한다.
  const blob = new Blob([fileData], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `배합비 보고서`);
};

const RawCostExcel = async () => {
  const params = { wrkCode: 'W202402030000005' };
  let prtFeed = await apiPrint.getPrtFeed({ params });
  prtFeed = prtFeed.map(item => {
    const totalCost = item.MXR_CPC * item.TTL_PRC; //수량*무게
    return {
      ...item, // 기존의 속성
      TOTAL_COST: totalCost,
    };
  });

  // 평균값과 합계값 계산
  let sumTTL_PRC = 0,
    sumMXR_CPC = 0,
    sumTOTAL_COST = 0;
  prtFeed.forEach(item => {
    sumTTL_PRC += item.TTL_PRC;
    sumMXR_CPC += item.MXR_CPC;
    sumTOTAL_COST += item.TOTAL_COST;
  });
  const avgTTL_PRC = sumTTL_PRC / prtFeed.length;
  const avgMXR_CPC = sumMXR_CPC / prtFeed.length;
  const avgTOTAL_COST = sumTOTAL_COST / prtFeed.length;

  // 평균값 데이터 추가
  prtFeed.push({
    FEED_CODE: 'AVG',
    TTL_PRC: avgTTL_PRC,
    MXR_CPC: avgMXR_CPC,
    TOTAL_COST: avgTOTAL_COST,
  });

  // 합계값 데이터 추가
  prtFeed.push({
    FEED_CODE: 'SUM',
    TTL_PRC: sumTTL_PRC,
    MXR_CPC: sumMXR_CPC,
    TOTAL_COST: sumTOTAL_COST,
  });

  console.log(prtFeed);

  const firstHeaderWidths = Array(8).fill(36); // 각 컬럼의 너비를 동일하게 설정

  // workbook 생성
  const wb = new Excel.Workbook();
  // sheet 생성
  const sheet = wb.addWorksheet('wonga bogoseo');

  sheet.addRow([
    '',
    'Raw Cost Table', //B
    '', //C
    '', //D
    '', //E
    '', //F
    '', //G
    '', //H
    '', //I
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
    '',
    '',
    '', //C
    '', //D
    `Date : ${prtFeed[0].FRS_RGS_DT}`, //E
    ,
    '', //F
    '', //G
    '', //H
    '', //I
    '',
    '',
    '',
    '', //M
    '',
    '',
    '', //P
    '', //Q
    '', //R
  ]);
  sheet.addRow([]);
  sheet.mergeCells('B1:D2'); //제목 셀 병합
  sheet.mergeCells('I3:K3'); //오른쪽

  // // 제목 스타일 지정 (선택사항)
  // titleRow.getCell(1).font = { name: "Arial", size: 16, bold: true }; //이 줄은 제목 셀의 글꼴 스타일을 지정. 글꼴 이름을 "Arial"로, 글꼴 크기를 16으로, 그리고 볼드체로 설정
  // titleRow.getCell(1).alignment = { vertical: "middle", horizontal: "center" }; //이 줄은 제목 셀의 정렬 방식을 지정. 수직 방향으로는 중앙에, 수평 방향으로는 가운데에 정렬하도록 설정.

  let cellB1 = sheet.getCell('B1');
  cellB1.font = { name: 'Arial', size: 18, bold: true };
  cellB1.alignment = { vertical: 'middle', horizontal: 'center' };

  let cellE3 = sheet.getCell('E3');
  cellE3.font = { name: 'Arial', size: 9 };
  cellE3.alignment = { vertical: 'middle', horizontal: 'right' };

  // 빈 행 삽입
  sheet.addRow([]);

  // 두 번째 테이블 헤더 생성
  const firstHeaderRow1 = sheet.getRow(5);
  //firstHeaderRow1.values = Object.keys(ntr[0]);
  firstHeaderRow1.values = [
    'Code',
    'Feed Name',
    'Cost',
    'Tonnes',
    'Total Cost',
  ];

  const firstHeaderRow2 = sheet.getRow(6); // 두 번째 헤더 행은 첫 번째 헤더 행 바로 다음 행
  firstHeaderRow2.values = [
    '', //A
    '', //B
    '', //C
    '', //D
    '(x1000)', //I
  ];

  // 첫 번째 열의 첫 번째 헤더 셀과 두 번째 헤더 셀을 병합
  sheet.mergeCells(`A5:A6`);
  sheet.mergeCells(`B5:B6`);
  sheet.mergeCells(`C5:C6`);
  sheet.mergeCells(`D5:D6`);

  firstHeaderRow1.eachCell((cell, colNum) => {
    styleHeaderCell(cell);
    sheet.getColumn(colNum).width = firstHeaderWidths[colNum - 1]; // 두 번째 테이블의 헤더 너비 설정
  });
  firstHeaderRow2.eachCell((cell, colNum) => {
    styleHeaderCell(cell);
    sheet.getColumn(colNum).width = firstHeaderWidths[colNum - 1]; // 두 번째 테이블의 헤더 너비 설정
  });

  // 각 Data cell에 데이터 삽입 및 스타일 지정
  prtFeed.forEach(
    ({
      FEED_CODE,
      FEED_NAME,
      TTL_PRC, //COST
      MXR_CPC, //TON
      TOTAL_COST,
    }) => {
      const rowDatas = [
        FEED_CODE,
        FEED_NAME,
        TTL_PRC, //COST
        MXR_CPC, //TON
        TOTAL_COST,
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
          cell.numFmt = '0.00';
        }
        if (colNum === 4) {
          cell.numFmt = '0.00';
        }
        if (colNum === 5) {
          cell.numFmt = '0.00';
        }
      });
    },
  );

  // 각 행에 대해서
  sheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
    // 각 행의 모든 셀에 대해서
    row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
      // 각 셀의 테두리를 없앱니다.
      cell.border = {
        top: { style: 'none' },
        left: { style: 'none' },
        bottom: { style: 'none' },
        right: { style: 'none' },
      };
    });
  });

  // 파일 생성
  const fileData = await wb.xlsx.writeBuffer(); //writeBuffer는 프로미스를 반환하므로 async-await을 사용해야 한다.
  const blob = new Blob([fileData], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `원가비용 보고서`);
};

const RMUsageExcel = async () => {
  const params = { wrkCode: 'W202402030000005', feedCode: '200210' };
  let mtrl = await apiPrint.getMtrlList({ params });

  // 평균값과 합계값 계산
  let sumTTL_PRC = 0,
    sumMXR_CPC = 0,
    sumTOTAL_COST = 0;
  prtFeed.forEach(item => {
    sumTTL_PRC += item.TTL_PRC;
    sumMXR_CPC += item.MXR_CPC;
    sumTOTAL_COST += item.TOTAL_COST;
  });
  const avgTTL_PRC = sumTTL_PRC / prtFeed.length;
  const avgMXR_CPC = sumMXR_CPC / prtFeed.length;
  const avgTOTAL_COST = sumTOTAL_COST / prtFeed.length;

  // 평균값 데이터 추가
  prtFeed.push({
    FEED_CODE: 'AVG',
    TTL_PRC: avgTTL_PRC,
    MXR_CPC: avgMXR_CPC,
    TOTAL_COST: avgTOTAL_COST,
  });

  // 합계값 데이터 추가
  prtFeed.push({
    FEED_CODE: 'SUM',
    TTL_PRC: sumTTL_PRC,
    MXR_CPC: sumMXR_CPC,
    TOTAL_COST: sumTOTAL_COST,
  });

  console.log(prtFeed);

  const firstHeaderWidths = Array(8).fill(36); // 각 컬럼의 너비를 동일하게 설정

  // workbook 생성
  const wb = new Excel.Workbook();
  // sheet 생성
  const sheet = wb.addWorksheet('wonga bogoseo');

  sheet.addRow([
    '',
    '', //B
    'Raw Cost Table', //C
    '', //D
    '', //E
    '', //F
    '', //G
    '', //H
    '', //I
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
    '',
    '',
    '', //C
    '', //D
    '', //E
    `Date : ${prtFeed[0].FRS_RGS_DT}`, //F
    '', //G
    '', //H
    '', //I
    '',
    '',
    '',
    '', //M
    '',
    '',
    '', //P
    '', //Q
    '', //R
  ]);
  sheet.addRow([]);
  sheet.mergeCells('C1:E2'); //제목 셀 병합

  // sheet.mergeCells("A3:B3"); //왼쪽
  // sheet.mergeCells("E3:F3"); //중앙
  sheet.mergeCells('F3:G3'); //오른쪽
  //sheet.mergeCells("A3:B4");

  // // 제목 스타일 지정 (선택사항)
  // titleRow.getCell(1).font = { name: "Arial", size: 16, bold: true }; //이 줄은 제목 셀의 글꼴 스타일을 지정. 글꼴 이름을 "Arial"로, 글꼴 크기를 16으로, 그리고 볼드체로 설정
  // titleRow.getCell(1).alignment = { vertical: "middle", horizontal: "center" }; //이 줄은 제목 셀의 정렬 방식을 지정. 수직 방향으로는 중앙에, 수평 방향으로는 가운데에 정렬하도록 설정.

  let cellC1 = sheet.getCell('C1');
  cellC1.font = { name: 'Arial', size: 18, bold: true };
  cellC1.alignment = { vertical: 'middle', horizontal: 'center' };

  let cellF3 = sheet.getCell('F3');
  cellF3.font = { name: 'Arial', size: 9 };
  cellF3.alignment = { vertical: 'middle', horizontal: 'right' };

  // 빈 행 삽입
  sheet.addRow([]);

  // 두 번째 테이블 헤더 생성
  const firstHeaderRow1 = sheet.getRow(5);
  //firstHeaderRow1.values = Object.keys(ntr[0]);
  firstHeaderRow1.values = [
    'Code', //A
    'Raw materials', //B
    'Cost', //C
    'Amount', //D
    '%', //E
    'Total Cost', //F
    '%', //G
  ];

  const firstHeaderRow2 = sheet.getRow(6); // 두 번째 헤더 행은 첫 번째 헤더 행 바로 다음 행
  firstHeaderRow2.values = ['', '', '', '(ton)', '', '(x1000)', ''];

  // 첫 번째 열의 첫 번째 헤더 셀과 두 번째 헤더 셀을 병합
  sheet.mergeCells(`A5:A6`);
  sheet.mergeCells(`B5:B6`);
  sheet.mergeCells(`C5:C6`);
  sheet.mergeCells(`E5:E6`);
  sheet.mergeCells(`G5:G6`);

  firstHeaderRow1.eachCell((cell, colNum) => {
    styleHeaderCell(cell);
    sheet.getColumn(colNum).width = firstHeaderWidths[colNum - 1]; // 두 번째 테이블의 헤더 너비 설정
  });
  firstHeaderRow2.eachCell((cell, colNum) => {
    styleHeaderCell(cell);
    sheet.getColumn(colNum).width = firstHeaderWidths[colNum - 1]; // 두 번째 테이블의 헤더 너비 설정
  });

  // 각 Data cell에 데이터 삽입 및 스타일 지정
  mtrl.forEach(
    ({
      MTRL_CODE,
      MTRL_NAME,
      PRC, //cost
      //amount
      //%
      //total cost
      //%
      MXR_RT,

      STAT,
      LWR_LMTR,
      UPER_LMTR,
      MTRL_COST,
      undetermined,
      CALC_MIN_VAL,
      CALC_MAX_VAL,
      UNT_PRC,
    }) => {
      const rowDatas = [
        MTRL_CODE,
        //      FEED_CODE,
        MTRL_NAME,
        MXR_RT,
        PRC,
        STAT,
        LWR_LMTR,
        UPER_LMTR,
        MTRL_COST,
        undetermined,
        CALC_MIN_VAL,
        CALC_MAX_VAL,
        UNT_PRC,
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
          cell.numFmt = '0.0000';
        }
        if (colNum === 4) {
          cell.numFmt = '0.00';
        }
        if (colNum === 6) {
          cell.numFmt = '0.00';
        }
        if (colNum === 7) {
          cell.numFmt = '0.00';
        }
        if (colNum === 8) {
          cell.numFmt = '0.00';
        }
        if (colNum === 9) {
          cell.numFmt = '0.00';
        }
        if (colNum === 10) {
          cell.numFmt = '0.00';
        }
      });
    },
  );

  // 각 행에 대해서
  sheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
    // 각 행의 모든 셀에 대해서
    row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
      // 각 셀의 테두리를 없앱니다.
      cell.border = {
        top: { style: 'none' },
        left: { style: 'none' },
        bottom: { style: 'none' },
        right: { style: 'none' },
      };
    });
  });

  // 파일 생성
  const fileData = await wb.xlsx.writeBuffer(); //writeBuffer는 프로미스를 반환하므로 async-await을 사용해야 한다.
  const blob = new Blob([fileData], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `원료사용 보고서`);
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
