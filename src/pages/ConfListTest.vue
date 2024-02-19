<template>
  <div class="q-pa-md bg-grey-9 text-white">
    <q-toggle color="blue" dark v-model="blue" />

    <q-toggle color="green" dark v-model="green" />

    <q-toggle color="yellow" dark v-model="yellow" />

    <q-toggle color="red" dark v-model="red" />
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, reactive } from 'vue';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const blue = ref(true);
const green = ref(null);
const yellow = ref(true);
const red = ref(false);

function resetModels() {
  blue.value = null;
  green.value = null;
  yellow.value = true;
  red.value = false;
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
