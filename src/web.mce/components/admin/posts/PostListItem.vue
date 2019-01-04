<template>
  <m-container>
    <m-title-col>
      <a-tag v-if="isDraft" color="red">草稿</a-tag>
      <nuxt-link :to="`/admin/posts/edit/${id}`">
        <m-title-content>
            {{ title }}
        </m-title-content>
      </nuxt-link>
    </m-title-col>
    <m-date-col>
      <m-date-content>创建于 {{ formatCreatedAt }}</m-date-content>
      <m-date-content>更新于 {{ formatUpdatedAt }}</m-date-content>
    </m-date-col>
  </m-container>
</template>

<script>
import styled from "vue-styled-components";
import { Tag } from "ant-design-vue";
import moment from "moment";

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
`;

const TitleCol = styled.div`
  display: flex;
  flex-grow: 5;
  align-items: center;
  marginmargin-right: 3rem;
  min-width: 0;
`;

const TitleContent = styled.div`
  font-size: 16px;
  color: #555;
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  flex: 1;
`;

const DateCol = styled.div`
  display: flex;
  flex-basis: auto;
  flex: 0 0 210px;
  flex-direction: column;
`;

const DateContent = styled.div`
  width: 100%;
  text-align: right;
  font-size: 13px;
  color: #bbbbbb;
`;

const timeFormat = "YYYY-MM-DD HH:mm:ss";

export default {
  name: "PostListItem",
  components: {
    "m-container": Container,
    "m-title-col": TitleCol,
    "m-title-content": TitleContent,
    "m-date-col": DateCol,
    "m-date-content": DateContent,
    "a-tag": Tag
  },
  computed: {
    formatCreatedAt() {
      return moment(this.createdAt).format(timeFormat);
    },
    formatUpdatedAt() {
      return moment(this.updatedAt).format(timeFormat);
    }
  },
  props: {
    isDraft: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    id: {
      type: Number
    },
    createdAt: {
      type: Number
    },
    updatedAt: {
      type: Number
    }
  }
};
</script>

