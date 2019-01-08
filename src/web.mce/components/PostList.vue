<template>
  <div class="wrapper">
    <div class="item" v-for="l in list" :key="l.title + '_' + l.link">
      <div class="title">
        <span class="link">
          <span class="link-logo">Δ</span>
          <nuxt-link :to="l.link">{{ l.title }}</nuxt-link>
        </span>
      </div>
      <div class="date">{{ l.date }}</div>
    </div>
  </div>
</template>

<script>
/**
model = {
  link: <link>,
  title: <title>,
  date: new Date(),
}
*/
export default {
  props: {
    list: Array
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
    font-family: 'OCR-A';
    letter-spacing: -1px;
    font-size: 21px;
    height: 42px;
    line-height: 42px;

    span.link {
      display: inline-block;
      max-width: 600px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    span.link-logo {
      display: inline-block;
      margin-right: 0.5em;
    }
    div.title {
      flex-grow: 4;
    }

    div.date {
      color: #aaa;
      flex-grow: 1;
      text-align: right;
    }
  }
}
</style>
