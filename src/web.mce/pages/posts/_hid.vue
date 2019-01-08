<template>
  <div class="content">
    <div class="title">{{ title }}</div>
    <div class="note">
      <div class="date">Published in {{ formatDate }}</div>
    </div>

    <div class="paragraph" v-html="content"></div>
  </div>
</template>

<script>
import moment from 'moment'
import apiBuilder from '~/helpers/apiBuilder'
import postService from '~/services/post'

export default {
  layout: 'content',
  data() {
    return {
      title: '',
      publishDate: 0,
      // TODO
      tags: [],
      content: ''
    }
  },
  computed: {
    formatDate() {
      return moment(this.publishDate).format('YYYY-MM-DD HH:mm')
    }
  },
  async asyncData({ store, params }) {
    const { hid } = params
    // TODO: use real HID
    const postAPI = apiBuilder(store)(postService)
    const post = await postAPI.getOnePublicPost(hid)

    return {
      title: post.title,
      publishDate: post.createdAt,
      content: post.content
    }
  }
}
</script>

<style lang="less" scoped>
div.content {
  padding-top: 5vh;
  // title
  div.title {
    font-size: 36px;
    font-family: 'OCR-A';
    word-spacing: -4px;
    letter-spacing: -4px;
  }

  div.note {
    color: #666;
    display: flex;
    justify-content: space-between;
    font-family: 'OCR-A';
    letter-spacing: -2px;
    // margin
    margin-top: 1vh;
    div.date {
      font-size: 17px;
    }
  }

  div.paragraph {
    color: #222;
    margin-top: 5vh;
    font-size: 20px;
  }
}
</style>
