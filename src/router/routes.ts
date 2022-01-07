import { RouteRecordRaw } from 'vue-router';
import StoreRoutes from '../pages/Stores/route'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue'), name: 'dashboard' },
      { 
        path: 'stores',
        component: () => import('pages/Stores.vue'),
        children: StoreRoutes
      }
    ],
  },

  {
    path: '/login',
    component: () => import('pages/Login.vue'),
    name: 'LoginPage'
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
