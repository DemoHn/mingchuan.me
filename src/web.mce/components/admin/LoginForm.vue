<template>
  <div class="form">
    <a-form
      layout="horizontal"
      class="login-form"
      @submit="handleSubmit"
      :autoFormCreate="
        form => {
          this.form = form
        }
      "
    >
      <a-form-item> <div class="title">Admin Login</div> </a-form-item>
      <a-form-item
        fieldDecoratorId="username"
        :fieldDecoratorOptions="{
          rules: [{ required: true, message: 'Please input your username!' }]
        }"
      >
        <a-input
          size="large"
          placeholder="UserName"
          ref="usernameInput"
          v-model="usernameContent"
        >
          <a-icon slot="prefix" type="user" />
          <a-icon
            v-if="usernameContent"
            slot="suffix"
            type="close-circle"
            @click="clearUsernameContent"
          />
        </a-input>
      </a-form-item>
      <a-form-item fieldDecoratorId="password">
        <a-input
          size="large"
          placeholder="PassWord"
          type="password"
          ref="passowrdInput"
          v-model="passwordContent"
        >
          <a-icon slot="prefix" type="lock" />
          <a-icon
            v-if="passwordContent"
            slot="suffix"
            type="close-circle"
            @click="clearPasswordContent"
          />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button
          v-if="!loginPending"
          type="primary"
          class="login-form-button"
          size="large"
          htmlType="submit"
        >
          Login
        </a-button>
        <a-button
          v-else
          type="primary"
          class="login-form-button"
          size="large"
          disabled
        >
          <a-icon type="loading" /> Login
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { Button, Form, Input, Icon } from 'ant-design-vue'
import authService from '~/services/auth'
const { Item } = Form

export default {
  components: {
    'a-button': Button,
    'a-form': Form,
    'a-form-item': Item,
    'a-icon': Icon,
    'a-input': Input
  },
  props: {
    loginPending: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      usernameContent: '',
      passwordContent: ''
    }
  },
  methods: {
    clearUsernameContent() {
      this.$refs.usernameInput.focus()
      this.usernameContent = ''
      this.form.setFieldsValue({ username: '' })
    },
    clearPasswordContent() {
      this.$refs.passowrdInput.focus()
      this.passwordContent = ''
      this.form.setFieldsValue({ password: '' })
    },
    async handleSubmit(e) {
      e.preventDefault()
      const { username, password } = this.form.getFieldsValue()
      // emit event
      this.$emit('submit', {
        username,
        password
      })
    }
  }
}
</script>

<style lang="less" scoped>
.form {
  display: flex;
  min-height: 300px;
  width: 420px;
  background-color: white;
  box-shadow: 0 0 8px 1px rgba(150, 150, 150, 0.2);
  padding: 1rem 2rem;

  .title {
    font-size: 22px;
    text-align: center;
  }

  .login-form {
    width: 100%;
  }

  .login-form-button {
    width: 100%;
  }
}
</style>
