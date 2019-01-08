<template>
  <admin-menu>
    <section class="container">Welcome to the template!</section>
  </admin-menu>
</template>

<script>
import AdminMenu from '~/components/admin/AdminMenu'

export default {
  layout: 'admin',
  components: {
    'admin-menu': AdminMenu
  }
}
</script>
