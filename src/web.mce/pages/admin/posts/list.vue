<template>
  <admin-menu :defaultKeys="defaultKeys">
    <post-list-container :postList="postList"></post-list-container>
  </admin-menu>
</template>

<script>
import AdminMenu from '~/components/admin/AdminMenu'
import PostListContainer from '~/components/admin/posts/PostListContainer'
// API
import apiBuilder from '~/helpers/apiBuilder'
import postService from '~/services/post'
// logic
import { getDefaultKeys } from '~/services/adminKey'

export default {
  components: {
    'admin-menu': AdminMenu,
    'post-list-container': PostListContainer
  },
  layout: 'admin',
  data() {
    return {
      postList: [],
      defaultKeys: {}
    }
  },
  async asyncData(context) {
    const { store, query } = context

    const $page = query.page || 1
    const postAPI = apiBuilder(store)(postService)
    const postList = await postAPI.listPost($page)

    const defaultKeys = getDefaultKeys(context)
    return { postList, defaultKeys }
  }
}
</script>
