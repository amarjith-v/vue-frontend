import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'LoginPage',
    component: Login,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('userInfo')) {
        next(false);
        router.push("/dashboard");
      } else {
        next();
      }
    }
  },
  {
    path: '/dashboard',
    name: 'DashboardPage',
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem('userInfo')) {
        next(false);
        router.push("/");
      } else {
        next();
      }
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router
