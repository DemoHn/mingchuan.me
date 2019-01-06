<template>
  <s-title>{{ title }}</s-title>
</template>

<script>
import styled from 'vue-styled-components'

const Title = styled.div`
  font-size: 50px;
  font-family: 'OCR-A';
`

export default {
  components: {
    's-title': Title
  },
  layout: 'content',
  data() {
    return {
      title: 'TT',
      publishDate: '',
      // TODO
      tags: [],
      content: ''
    }
  }
}
</script>
