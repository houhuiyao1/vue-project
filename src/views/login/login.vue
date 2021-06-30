<template>
<!-- :model="ruleForm" :rules="rules" ref="ruleForm" porp='name'-->
<div class="login">
  <el-form 
    label-position='top'
    ref="form" 
    :model="form"
    :rules="rules"
    label-width="80px"
    >
    <el-form-item label="手机号" prop='phone'>
      <el-input v-model="form.phone"></el-input>
    </el-form-item>
      <el-form-item label="密码" prop='password'>
        <el-input v-model="form.password"></el-input>
      </el-form-item>
    <el-form-item>
      <el-button 
      :loading='form.isLoading'
      class="login-btn" 
      type="primary" 
      @click="onSubmit"
      >登录</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Form} from 'element-ui'
import {login} from '@/services/user'
import store from '@/store'

export default Vue.extend({
  name: 'LoginIndex',
  data() {
      return {
        form: {
          isLoading:false,
          phone:'18201288771',
          password:'111111'
        },
        rules: {
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern:/^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 18, message: '长度为6-18位', trigger: 'blur' }
          ]
        }
      }
    },
  methods: {
      async onSubmit() {
        try{
          await (this.$refs.form as Form).validate()//表单验证是否通过
          this.form.isLoading = true
          const {data} = await login(this.form)

          if(data.state !== 1){
            this.$message.error(data.message)
          }else{
            //登陆成功则记录用户登陆状态
            this.$store.commit('setUser',data.content)
            //成功则跳转
            this.$router.push(this.$route.query.redirect as string || '/')
            // this.$router.push({
            //   name:'home'
            // })
            this.$message.success('登陆成功')   
          }
        }catch(err){
          console.log('登陆失败',err);
        }
        //结束登录按钮loading
        this.form.isLoading = false
      }      
    }
})
</script>

<style lang='scss' scoped>
  .login{
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-form{
      width:300px;
      padding: 20px;
      background: white;
      border-radius: 5px;
    }
    .login-btn{
      width: 100%;
    }
  }
</style>
