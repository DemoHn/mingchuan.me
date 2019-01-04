<template>
  <div class="container">
    <a-layout>
      <a-layout-header>
        <div class="header">
          <div class="logo">mingchuan.me</div>
          <div class="text-button" @click="logout">
            <a-icon type="poweroff"/>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content class="content_container">
        <a-layout class="inner_layout">
          <nuxt />
        </a-layout>
      </a-layout-content>
      <a-layout-footer>
        <div class="footer">mingchuan.me - {{ currentYear }}</div>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script>
import { Layout, Menu, Icon } from 'ant-design-vue'

const { Header, Content, Footer } = Layout

export default {
  components: {
    [Layout.name]: Layout,
    [Icon.name]: Icon,
    // layout components
    [Header.name]: Header,
    [Content.name]: Content,
    [Footer.name]: Footer,
  },
  data() {
    return {
      currentYear: (new Date()).getFullYear(),
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout')
      this.$router.push({ path: '/admin/login' })
    }
  }
}
</script>

<style lang="less" scoped>
div.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;

  .content_container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  .inner_layout {
    max-width: 1300px;
    min-height: 80vh;
    margin: 2rem 1rem;
    padding: 2rem 2rem;
    background-color: white;
  }

  .footer {
    text-align: center;
  }

  .header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    .logo {
      width: 100px;
      font-size: 15px;
      color: white;
    }

    .text-button {
      font-size: 15px;
      color: white;
      cursor: pointer;
    }
  }
}
</style>
