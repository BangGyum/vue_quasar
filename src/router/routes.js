const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'Typography', component: () => import('pages/Typography.vue') },
      { path: 'Breakpoints', component: () => import('pages/Breakpoints.vue') },
      { path: 'confList', component: () => import('pages/ConfList.vue') },
      { path: 'confInsert', component: () => import('pages/ConfInsert.vue') },
      { path: 'confUpdate', component: () => import('pages/ConfUpdate.vue') },
    ],
  },
  {
    path: '/aa',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'Typography', component: () => import('pages/Typography.vue') },
      { path: 'Breakpoints', component: () => import('pages/Breakpoints.vue') },
      { path: 'confList', component: () => import('pages/ConfList.vue') },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
