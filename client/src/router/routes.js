
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'cards', component: () => import('pages/cards/Index.vue') },
      { path: 'cards/new', component: () => import('pages/cards/Form.vue') },
      { path: 'cards/form/:id', component: () => import('pages/cards/Form.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
