import store from '@/store'
import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Layout from '../layout/index.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/*webpackChunkName:'login'*/'@/views/login/login.vue')
  },
  {
    path:'/',
    component:Layout,
    meta:{
      requiresAuth:true
    },
    children:[
      {
        path: '/',
        name: 'home',
        component: () => import(/*webpackChunkName:'home'*/'@/views/home/home.vue')
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/*webpackChunkName:'role'*/'@/views/role/role.vue')
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/*webpackChunkName:'menu'*/'@/views/menu/menu.vue')
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/*webpackChunkName:'resource'*/'@/views/resource/resource.vue')
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/*webpackChunkName:'course'*/'@/views/course/course.vue')
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/*webpackChunkName:'user'*/'@/views/user/user.vue')
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/*webpackChunkName:'advert'*/'@/views/advert/advert.vue')
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/*webpackChunkName:'advert-space'*/'@/views/advert-space/advert-space.vue')
      },
      {
        path: '/menu/create',
        name: 'menu-create',
        component: () => import(/*webpackChunkName:'menu-create'*/'@/views/menu/create.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

//全局前置守卫：任何页面的访问都要经过这里
//to:要去哪里的路由信息
//from:从哪里来的路由信息
//next:通行的标志
router.beforeEach((to,from,next)=>{
  //to.match是一个数组，匹配的是路由记录
  if(to.matched.some(record => record.meta.requiresAuth)){
    if(!store.state.user){
      //跳转到登陆页面
      next({
        name:'login',
        query:{//通过url传递查询字符串参数
          redirect: to.fullPath//把登陆成功需要返回的页面告诉登陆页面
        }
      })
    }else{
      next()
    }
  }else{
    next()
  }
  //一定要调用next，否则页面无法展示
  next()
})

export default router
