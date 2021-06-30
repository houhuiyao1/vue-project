import axios from 'axios'
import store from '@/store/index'
import {Message} from 'element-ui'
import router from '@/router/index'
import qs from 'qs'

const request = axios.create({
})

function redirectLogin(){
  router.push({
    name:'login',
    query:{
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken(){
  return axios.create()({
    method:'POST',
    url:'/front/user/refresh_token',
    data:qs.stringify({
      refreshtoken:store.state.user.refresh_token
    })
  })
}

//请求拦截器
request.interceptors.request.use(function(config){
  const {user} = store.state
  //改写config配置信息来实现业务的统一处理
  if(user && user.access_token){
    config.headers.Authorization = user.access_token
  }
  //一定要返回config，否则请求发不出去
  return config
},function(err){
  return Promise.reject(err)
})

//响应拦截器
request.interceptors.response.use(function(response){
  //如果是自定义状态码，错误处理写到这里 
  return response
},async function(error){
  //如果是使用的http状态码，错误处理写到这里
  // console.dir(err)
  if(error.response){//请求发出去收到响应了，但是状态码超出了2xx的范围
    const {status} = error.response
    if(status == 400){
      Message.error('请求参数错误')
    }else if(status == 401){
      //token无效(没有提供token,token是无效的，token过期了)
      if(!store.state.user){
        redirectLogin()
        return Promise.reject(error)
      }
      //尝试获取新的token
      refreshToken().then(res=>{
        if(!res.data.success){
          throw new Error('刷新Token失败')
        }

        store.commit('setUser',res.data.content)
        return request(error.config)

      }).catch(error=>{
        store.commit('setUser', null)
        redirectLogin()
        return Promise.reject(error)
      })
    }else if(status == 403){
      Message.error('没有权限，请联系管理员')
    }else if(status == 404){
      Message.error('访问资源不存在')
    }else if(status >= 500){
      Message.error('服务端错误，请联系管理员')
    }
  }else if(error.request){//请求发出去了但是没有收到响应
    Message.error('请求超时')
  }else{//在设置请求时发生了一些事情，出发了一个错误
    Message.error(`请求失败,${error.message}`)
  }
  return Promise.reject(error)
})



export default request
