<template>
  <div class="header">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar 
        shape="square" 
        :size="35" 
        :src='userInfo.portrait || require("@/assets/default-image.png")'></el-avatar>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{userInfo.userName}}</el-dropdown-item>
        <el-dropdown-item 
        divided
        @click.native="handleLogout"
        >退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {getUserinfo} from '@/services/user'

export default Vue.extend({
  name:'AppHeader',
  data(){
    return{
      userInfo:{}
    }
  },
  created () {
    this.loadUserinfo()
  },
  methods: {
    async loadUserinfo(){
      const {data} = await getUserinfo()
      this.userInfo = data.content
    },
    handleLogout(){
      this.$confirm('确认要退出码?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          //清楚登陆状态
          this.$store.commit('setUser',null)
          //跳转到登陆页面
          this.$router.push({
            name:'login'
          })

          this.$message({
            type: 'success',
            message: '退出成功!'
          });
        }).catch(() => {        
        });
    }
  }
})
</script>

<style>
  .header{
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .el-dropdown-link{
    display: flex;
    align-items: center;
  }
</style>