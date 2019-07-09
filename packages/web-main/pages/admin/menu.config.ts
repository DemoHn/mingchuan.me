export default {
  routes: [
    {
      name: '文章',
      icon: 'calendar',
      key: 'posts', // --> route = /admin/posts
      children: [
        {
          name: '文章列表',
          icon: 'file-text',
          key: 'list', // --> route = /admin/posts/list
        },
        {
          name: '创建文章',
          icon: 'file-add',
          key: 'new', // --> route = /admin/posts/new
        },
      ],
    },
  ],
}
