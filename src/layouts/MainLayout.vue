<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
const linksList = [
  //여기의 메뉴 목록은 위에 EssenstialLink 컴포넌트로 렌더링되기 때문에 위에서 수정
  {
    title: 'Typography',
    caption: 'quasar.dev',
    icon: 'school',
    to: '/typography',
  },
  {
    title: 'Breakpoints',
    caption: 'quasar.dev',
    icon: 'school',
    to: '/breakpoints',
  },
  {
    title: 'ConfList',
    caption: 'quasar.dev',
    icon: 'school',
    to: '/confList',
  },
  {
    title: 'ConfListServer',
    caption: 'quasar.dev',
    icon: 'school',
    to: '/confListServer',
  },
  {
    title: 'ConfListTest',
    caption: 'quasar.dev',
    icon: 'school',
    to: '/confListTest',
  },
  {
    title: 'ConfInsert',
    caption: 'quasar.dev',
    icon: 'school',
    to: '/confInsert',
  },
  {
    title: 'ConfUpdate',
    caption: 'quasar.dev',
    icon: 'school',
    to: '/confUpdate',
  },
];
</script>

<script setup>
import { ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';

const leftDrawerOpen = ref(false);
const essentialLinks = linksList;
const toggleLeftDrawer = () => (leftDrawerOpen.value = !leftDrawerOpen.value);
</script>
