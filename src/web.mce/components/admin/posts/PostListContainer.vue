<script>
import styled from 'vue-styled-components'
import PostListItem from './PostListItem'

const ListContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
`

const EmptyListDiv = styled.div`
  font-size: 20px;
  color: #bababa;
  text-align: center;
`

const EmptyListDivContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const NormalItemContainer = styled.section`
  border-bottom: 1px solid #ddddddaa;
  width: 100%;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
`

const LastItemContainer = styled.section`
  width: 100%;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
`

export default {
  name: 'PostListContainer',
  components: {
    'list-container': ListContainer,
    'empty-div': EmptyListDiv,
    'empty-div-container': EmptyListDivContainer,
    'n-post-list-container': NormalItemContainer,
    'l-post-list-container': LastItemContainer,
    'post-list-item': PostListItem
  },
  props: {
    postList: {
      type: Array
    }
  },
  data() {
    return {}
  },
  render(h) {
    const hasList = this.postList && this.postList.length > 0
    return (
      <list-container>
        {hasList ? (
          this.postList.map((item, index) => {
            return index < this.postList.length - 1 ? (
              <n-post-list-container>
                <post-list-item
                  id={item.id}
                  title={item.title}
                  isDraft={item.isDraft}
                  updatedAt={item.updatedAt}
                  createdAt={item.createdAt}
                />
              </n-post-list-container>
            ) : (
              <l-post-list-container>
                <post-list-item
                  id={item.id}
                  title={item.title}
                  isDraft={item.isDraft}
                  updatedAt={item.updatedAt}
                  createdAt={item.createdAt}
                />
              </l-post-list-container>
            )
          })
        ) : (
          <empty-div-container>
            <empty-div> 无文章 </empty-div>
          </empty-div-container>
        )}
      </list-container>
    )
  }
}
</script>
