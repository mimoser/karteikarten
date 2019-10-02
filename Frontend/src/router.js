import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './views/Dashboard.vue';
import store from './store/store';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
      // component: () => import(/* webpackChunkName: "dashboard" */ './views/Dashboard.vue')      
    },
    {
      path: '/profile',
      name: 'profile',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "profile" */ './views/Profile.vue')
    },
    {
      path: '/mydecks',
      name: 'mydecks',
      component: () => import(/* webpackChunkName: "mydecks" */ './views/MyDecks.vue')
    },
    {
      path: '/deckEditor',
      name: 'deckEditor',
      component: () => import(/* webpackChunkName: "deckEditor" */ './views/DeckEditor.vue')
    },
    {
      path: '/mydecks/deck/:id?',
      name: 'deck',
      component: () => import(/* webpackChunkName: "deck" */ './views/Deck.vue')
    },
    {
      path: '/mydecks/deck/:id/learn',
      name: 'learn',
      component: () => import(/* webpackChunkName: "deck" */ './views/Learn.vue')
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
    },
    {
      path: '/forgotPassword',
      name: 'forgotPassword',
      component: () => import(/* webpackChunkName: "forgotPassword" */ './views/ForgotPassword.vue')
    }

  ],
  mode: 'history'
});

router.beforeEach((to, from, next) => {
  // store.dispatch('retrieveToken');

  if (to.fullPath === '/') {
    if (!store.state.accessToken) {
      next('/login');
    } else {
      next('/dashboard');
    }
  }
  if (to.fullPath === '/dashboard') {
    if (!store.state.accessToken) {
      next('/login');
    }
  }
  if (to.fullPath === '/mydecks') {
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

// router.afterEach((to, from, next) => {
//   if (to.fullPath === '/dashboard' && from.fullPath === '/register'){
//     debugger;
//     console.log(Dashboard);
//     // this.$bvToast.toast(`Account created successfully`, {
//     //   title: "Registration succeeded",
//     //   variant: 'info',
//     //   toaster: 'b-toaster-top-center',
//     //   autoHideDelay: 5000,
//     //   appendToast: true
//     // });
//   }
// });


export default router;
