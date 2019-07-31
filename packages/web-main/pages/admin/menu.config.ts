export default {
  routes: [
    {
      name: '文章',
      icon: 'calendar',
      key: 'posts', // --> route = /admin/posts
      children: [
        {
          name: '所有文章',
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
    {
      name: '用户',
      icon: 'user',
      key: 'accounts',
      children: [
        {
          name: '更新密码',
          icon: 'lock',
          key: 'updatePassword',
        },
      ],
    },
  ],
}
