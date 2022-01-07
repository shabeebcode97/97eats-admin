const routes = [
    {path:'', component: () => import('pages/Stores/Index.vue')},
    {path:'create', component: () => import('pages/Stores/Create.vue')},
    {path:'edit/:id', component: () => import('pages/Stores/Create.vue')}
];

export default routes