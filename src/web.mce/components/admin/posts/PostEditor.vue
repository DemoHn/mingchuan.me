<template>
  <section class="container">
    <section class="title">
      <input
        class="input-title"
        placeholder="来个标题吧"
        type="text"
        v-model="qTitle"
      />
    </section>
    <section class="content">
      <div
        class="quill-editor"
        :content="qContent"
        @change="onEditorChange($event)"
        v-quill="editorOption"
      ></div>
    </section>
    <section class="footer">
      <a-button type="primary" class="tool-button" @click="() => save(false)"
        >发布</a-button
      >
      <a-button class="tool-button" @click="() => save(true)"
        >保存为草稿</a-button
      >
    </section>
  </section>
</template>

<script>
import { Button } from 'ant-design-vue'

export default {
  name: 'PostEditor',
  components: {
    'a-button': Button
  },
  props: {
    title: {
      type: String
    },
    content: {
      type: String
    }
  },
  data() {
    return {
      qTitle: this.title,
      qContent: this.content,
      editorOption: {
        // some quill options
        placeholder: '写点什么吧...',
        modules: {
          toolbar: [
            [{ font: [] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ align: [] }],
            [{ color: [] }, { background: [] }]
          ]
        }
      }
    }
  },
  methods: {
    onEditorChange({ html }) {
      this.qContent = html
    },
    // emit 'save' event
    // data: {
    //   "title": <title>,
    //   "content": <content>
    //}
    save(isDraft) {
      const resultData = {
        title: this.qTitle,
        content: this.qContent,
        isDraft
      }

      this.$emit('save', resultData)
    }
  }
}
</script>

<style lang="less">
// quill editor global style
// remove quill editor's border

@containerFont: 16px;
.ql-snow {
  &.ql-toolbar,
  &.ql-container {
    border: none !important;
    font-size: 15px;
  }

  &.ql-container {
    font-size: @containerFont;
    line-height: 1.5;

    p {
      margin-bottom: 1.2 * @containerFont;
    }
  }
}
</style>

<style lang="less" scoped>
.container {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: hidden;
  height: 100%;

  .title {
    border-bottom: 1px solid #dcdcdc;
    padding-bottom: 1.5rem;
    margin-bottom: 0.5rem;

    .input-title {
      font-size: 24px;
      line-height: 1;
      width: 100%;
      display: block;
      outline: none;
      border: none;

      &::placeholder {
        opacity: 0.6;
      }
    }
  }

  .content {
    flex-grow: 2;
  }

  .footer {
    padding-top: 1rem;
    box-shadow: 0 -1px 3px 1px #bebebe70;
    .tool-button {
      margin-right: 1rem;
    }
  }
}
</style>
