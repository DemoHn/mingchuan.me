<template lang="html">
  <div class="container">
    <login-form @submit="handleSubmit" :loginPending="isLoginPending"></login-form>
  </div>
</template>

<script>
import LoginForm from '../../components/admin/LoginForm.vue'
import delay from '../../helpers/delay'
import { message } from 'ant-design-vue'

export default {
  components: {
    LoginForm
  },
  data() {
    return {
      isLoginPending: false,
    }
  },
  methods: {
    async handleSubmit(loginData) {
      this.isLoginPending = true
      try {
        await Promise.all([
          this.$store.dispatch('user/login', loginData),
          delay(500)
        ])

        this.isLoginPending = false
        this.$router.push({ path: '/admin' })
      } catch (error) {
        this.isLoginPending = false
        message.error('login error', 2)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
}
</style>
