<template>
  <div class="frame">
    <div class="content"><nuxt /></div>
  </div>
</template>

<style lang="less" scoped>
div.frame {
  min-height: 100vh;
  display: flex;
  justify-content: center;

  div.content {
    width: 900px;
    display: flex;
    flex-direction: column;
    color: #111;
  }
}
</style>
