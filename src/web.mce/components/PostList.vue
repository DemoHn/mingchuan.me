<template>
  <div class="wrapper">
    <div class="item">
      <div class="title">Δ </div>
      <div class="date">DD</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
div.wrapper {
  display: flex;
  flex-direction: column;

  div.item {
    display: inline-flex;
    flex-flow: space-between;
    div.title {
      flex-grow: 4;
    }

    div.date {
      flex-grow: 1;
    }
  }
}
</style>
