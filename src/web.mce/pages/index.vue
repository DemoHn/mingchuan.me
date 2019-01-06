<template>
  <div class="container">
    <div class="tag">
      <div class="title">Hi, This is Mingchuan</div>
      <div><i>This site is under construction</i></div>
      <div class="time">{{ displayTime }}</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  layout: 'default',
  data() {
    return {
      currentTime: Date.now()
    }
  },
  computed: {
    displayTime() {
      return moment(this.currentTime).format('YYYY/MM/DD HH:mm:ss')
    }
  },
  mounted() {
    const self = this
    setInterval(() => {
      self.currentTime = Date.now()
    }, 500)
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.container .tag {
  font-size: 1.4rem;
}

.container div {
  margin-bottom: 0.8rem;
}

.container .title {
  font-size: 3rem;
}

.container .time {
  font-size: 1.5rem;
  color: #396245;
}
</style>
