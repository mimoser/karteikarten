import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard.vue'
import { store } from './store/store';

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
      // component: () => import(/* webpackChunkName: "dashboard" */ './views/Dashboard.vue')      
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import(/* webpackChunkName: "register" */ './views/Register.vue')
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import(/* webpackChunkName: "logout" */ './views/Logout.vue')
    }

  ],
  mode: 'history'
});

router.beforeEach((to, from, next) => {
  // store.dispatch('retrieveToken');

  if (to.fullPath === '/') {
    if (!store.state.accessToken) {
      next('/login');
    }
  }
  if (to.fullPath === '/dashboard') {
    if (!store.state.accessToken) {
      next('/login');
    }
  }
  if (to.fullPath === '/login') {
    if (store.state.accessToken) {
      next('/dashboard');
    }
  }
  if (to.fullPath === '/register') {
    if (store.state.accessToken) {
      next('/dashboard');
    }
  }
  next();
});


export default router;
