<template>
  <div class="container">
    <div class="container-h">
      <div class="logo">mingchuan.me</div>
      <div class="motto">這個世界的異鄉人</div>
      <post-list></post-list>
    </div>
  </div>
</template>

<script>
import PostList from '~/components/PostList'
export default {
  components: {
    'post-list': PostList
  },
  layout: 'content'
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  align-items: center;
  height: 100vh;

  .container-h {
    display: flex;
    flex-direction: column;
    width: 600px;

    div.logo {
      font-family: 'OCR-A';
      font-size: 48px;
      color: #222;
      letter-spacing: -2px;
    }

    div.motto {
      font-size: 20px;
      color: #666;
      letter-spacing: 3px;
    }
  }
}
</style>
