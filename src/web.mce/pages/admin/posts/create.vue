<template>
  <admin-menu :defaultKeys="defaultKeys">
    <post-editor @save="saveHandler"></post-editor>
  </admin-menu>
</template>

<script>
import AdminMenu from '~/components/admin/AdminMenu'
import PostEditor from '~/components/admin/posts/PostEditor'
import postService from '~/services/post'
import { message } from 'ant-design-vue'
// logic
import apiBuilder from '~/helpers/apiBuilder'
import { getDefaultKeys } from '~/services/adminKey'

export default {
  components: {
    'admin-menu': AdminMenu,
    'post-editor': PostEditor
  },
  data() {
    return {
      defaultKeys: {}
    }
  },
  layout: 'admin',
  methods: {
    // see <post-editor> for postData data type
    async saveHandler(postData) {
      const postAPI = apiBuilder(this.$store)(postService)
      const { isDraft } = postData
      const publishWord = isDraft ? '保存草稿' : '发布'
      try {
        const { data } = await postAPI.createPost(postData)
        message.info(` ${data.title} ${publishWord}成功! id: ${data.id}`)
      } catch (error) {
        message.error(`${publishWord}失败! 错误: ${error}`)
      }
    }
  },
  async asyncData(context) {
    const defaultKeys = getDefaultKeys(context)
    return { defaultKeys }
  }
}
</script>
