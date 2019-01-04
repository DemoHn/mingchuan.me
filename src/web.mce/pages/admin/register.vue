<template lang="html">
  <div class="container">
    <register-form @submit="handleSubmit" :registerPending="isRegisterPending"></register-form>
  </div>
</template>

<script>
import RegisterForm from '../../components/admin/RegisterForm.vue'
import delay from '../../helpers/delay'
import { message } from 'ant-design-vue'

export default {
  components: {
    RegisterForm
  },
  data() {
    return {
      isRegisterPending: false,
    }
  },
  methods: {
    async handleSubmit(registerData) {
      this.isRegisterPending = true
      try {
        await Promise.all([
          this.$store.dispatch('user/register', registerData),
          delay(500)
        ])

        this.isRegisterPending = false
        this.$router.push({ path: '/admin' })
      } catch (error) {
        this.isRegisterPending = false
        message.error('register error', 2)
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
