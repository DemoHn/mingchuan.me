<template>
  <div class="container">
    <div class="container-h">
      <div class="logo">mingchuan.me</div>
      <div class="motto">這個世界的異鄉人</div>
      <post-list :list="postList"></post-list>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import PostList from '~/components/PostList'
// API
import apiBuilder from '~/helpers/apiBuilder'
import postService from '~/services/post'

export default {
  components: {
    'post-list': PostList
  },
  layout: 'content',
  data() {
    return {
      postList: []
    }
  },
  async asyncData(context) {
    const { store } = context

    const postAPI = apiBuilder(store)(postService)
    const rawPostList = await postAPI.listPublicPosts(5)

    const postList = rawPostList.map(list => ({
      link: `/posts/${list.id}`,
      title: list.title,
      date: moment(list.createdAt * 1000).format('YYYY-MM-DD')
    }))
    return { postList }
  }
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
    width: 750px;

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
      margin-bottom: 24px;
    }
  }
}
</style>
