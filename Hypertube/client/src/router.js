import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home'
import Login from '@/views/Login'
import Search from '@/views/Search'
import Movie from '@/views/Movie'
import User from '@/views/User'
import NotFound from '@/views/NotFound'
import Register from '@/views/Register'
import RecoveryPassword from '@/views/RecoveryPassword'
import ForgotPassword from '@/views/ForgotPassword'
import ConfirmEmail from '@/views/ConfirmEmail'
import UpdateUser from '@/views/UpdateUser'
import OAuthLogin from '@/views/OAuthLogin'
import Watch from '@/views/Watch'
import store from '@/store'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: {
        path: '/home',
      },
      meta: {
        auth: 'required',
      }
    },
    {
      path: '/home',
      component: Home,
      meta: {
        black: true,
        auth: 'required',
      }
    },
    {
      path: '/user/:id?',
      component: User,
      meta: {
        black: true,
        auth: 'required',
      }
    },
    {
      path: '/update-user',
      component: UpdateUser,
      meta: {
        black: true,
        auth: 'required',
      }
    },
    {
      path: '/movie/:id',
      component: Movie,
      meta: {
        auth: 'required',
      }
    },
    {
      name: 'search',
      path: '/search',
      component: Search,
      meta: {
        black: true,
        auth: 'required',
    }
    },
    {
      path: '/watch/:id',
      component: Watch,
      meta: {
        black: true,
        auth: 'required',
      }
    },
    {
      path: '/login',
      component: Login,
      meta: {
        auth: 'reject',
      }
    },
    {
      path: '/oauth/:provider(github|42)',
      component: OAuthLogin,
      meta: {
        auth: 'reject',
      }
    },
    {
      path: '/register',
      component: Register,
      meta: {
        auth: 'reject',
      }
    },
    {
      path: '/recovery-password/:id',
      component: RecoveryPassword,
      meta: {
        auth: 'reject',
      }
    },
    {
      path: '/confirm-email/:id',
      component: ConfirmEmail,
      meta: {
        auth: 'reject',
      }
    },
    {
      path: '/forgot-password',
      component: ForgotPassword,
      meta: {
        auth: 'reject',
      }
    },
    {
      path: '*',
      component: NotFound,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.auth === 'required' && !store.state.user.logged) {
    return next('/login')
  }
  if (to.meta && to.meta.auth === 'reject' && store.state.user.logged) {
    return next('/home')
  }
  document.body.className = to.meta && to.meta.black === true ? 'black' : ''
  return next()
})

export default router
