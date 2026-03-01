import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      children: [
        { path: '', name: 'home', component: () => import('../views/HomeView.vue') },
        { path: 'pets', name: 'pets', component: () => import('../views/PetsView.vue') },
        { path: 'pet/:id', name: 'petDetail', component: () => import('../views/PetDetailView.vue') },
        { path: 'users', name: 'users', component: () => import('../views/UsersView.vue') },
      ]
    },
    {
      path: '/auth',
      component: () => import('../layouts/AuthLayout.vue'),
      children: [
        { path: 'login', name: 'login', component: () => import('../views/LoginView.vue') },
        { path: 'register', name: 'register', component: () => import('../views/RegisterView.vue') }
      ]
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../layouts/AuthLayout.vue'),
      children: [
        { path : '', name: 'adminHome', component: () => import('../views/AdminView.vue') }
      ]
      // Aquí es donde en el futuro pondremos la "guardia" para que 
      // nadie entre escribiendo /admin en la URL si no es admin.
    }

  ]
});

export default router;