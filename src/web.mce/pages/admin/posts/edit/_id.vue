<template>
  <admin-menu>
    <post-editor
      :title="title"
      :content="content"
      @save="saveHandler"
    ></post-editor>
  </admin-menu>
</template>

<script>
import AdminMenu from '~/components/admin/AdminMenu'
import PostEditor from '~/components/admin/posts/PostEditor'
import { message } from 'ant-design-vue'
// API
import apiBuilder from '~/helpers/apiBuilder'
import postService from '~/services/post'

export default {
  components: {
    'admin-menu': AdminMenu,
    'post-editor': PostEditor
  },
  layout: 'admin',
  data() {
    return {
      currentId: null,
      title: '',
      content: ''
    }
  },
  methods: {
    async saveHandler(postData) {
      const postAPI = apiBuilder(this.$store)(postService)
      try {
        const { data } = await postAPI.updatePost(this.currentId, postData)
        message.info(` ${data.title} 更新成功! id: ${data.id}`)
      } catch (error) {
        message.error(`更新失败! 错误: ${error}`)
      }
    }
  },
  async asyncData({ store, params }) {
    const { id } = params
    const postAPI = apiBuilder(store)(postService)
    const post = await postAPI.getOnePost(id)

    return {
      currentId: id,
      title: post.title,
      content: post.content
    }
  }
}
</script>
