<template>
  <div class="layout-sidebar">
    <div v-show="!isLeetCode" class="post-highlights">
      <header>
        精选文章
      </header>
      <ul class="post-highlights-list">
        <li v-for="item in blogs" :key="item.id">
          <router-link
            :to="{ name: 'BlogDetail', params: { id: item.id, article: item } }"
          >{{ item.title }}</router-link>
        </li>
      </ul>
    </div>
    <div class="tags">
      <header>标签</header>
      <div class="tags-list">
        <router-link
          v-for="item in currentTags"
          :key="item.name + item.id"
          class="tags-list-item"
          tag="div"
          :to="{
            path: `${isLeetCode ? '/leetcode' : '/blog'}`,
            query: { tagId: item.id },
          }"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
    <div v-show="$route.path === '/'" class="message">
      <header>
        留言
      </header>
      <form>
        <p>
          很高兴认识你，我们一起交流吧！
        </p>
        <div>
          <label for="message">Message</label><input type="hidden" value="1" name="embed">
          <div class="input-box">
            <input
              id="message"
              :value="message"
              type="text"
              name="message"
              @input="(e) => (message = e.target.value)"
            >
            <button type="button" @click="leaveMessage">
              <svg-icon icon="send" />
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      blogs: [],
      tags: {}
    }
  },
  computed: {
    isLeetCode({ $route }) {
      return /leetcode/i.test($route.name)
    },
    currentTags({ isLeetCode, tags, $route }) {
      return isLeetCode ? tags.leetcode : tags.ordinary || []
    }
  },
  created() {
    this.getHighlights()
    this.getTags()
  },
  methods: {
    async leaveMessage() {
      const msg = this.message
      if (!msg) return

      if (!this.$parent.token) {
        this.$login()
        return
      }

      try {
        await this.$http('/comments/create', {
          method: 'post',
          data: { content: msg }
        })
        this.$message({ message: '留言成功' })
        this.message = ''
      } catch (err) {
        console.log(err)
      }
    },
    async getHighlights() {
      try {
        const res = await this.$http('/blogs/highlights', {
          params: { size: 5 }
        })
        this.blogs = res.data
      } catch (err) {
        console.log(err)
      }
    },
    async getTags() {
      try {
        const res = await this.$http('/tags/list')
        this.tags = res.data
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-sidebar {
  grid-area: sidebar;
  padding: 0 1rem;
}
.post-highlights,
.tags,
.message {
  border: 1px solid var(--blue-dark);
  margin: 1rem 0px;
  border-radius: 0.5rem;
  background-color: var(--white);
  overflow: hidden;
  header {
    color: var(--white);
    background-color: var(--blue-dark);
    padding: 0.5rem 1rem;
    border-bottom: 1px solid var(--blue-dark);
    overflow: hidden;
    font-size: var(--font-default);
  }
}
.post-highlights {
  .post-highlights-list {
    padding: 0px;
    margin: 0px;
    li {
      position: relative;
    }
    a {
      font-weight: normal;
      background-image: none;
      display: block;
      padding: 0.5rem 1rem 0.5rem 2rem;
      position: relative;
      &:hover {
        background-color: var(--gray-lightest);
        &::before {
          left: 0.75rem;
        }
      }
      &::before {
        content: '➤';
        position: absolute;
        top: 50%;
        left: 0.5rem;
        transform: translateY(-50%);
        transition: left 300ms ease-in-out 0s;
      }
    }
  }
}

.tags {
  &-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 0.5rem;
    &-item {
      cursor: pointer;
      padding: 0.3rem 0.4rem;
      &:hover {
        border-radius: 0.3rem;
        background-color: var(--gray-lightest);
      }
    }
  }
}

.message {
  form {
    padding: 0px 1rem;
    & > div {
      display: flex;
      flex-direction: column;
      margin-bottom: 1rem;
      label {
        margin-bottom: 0.25rem;
        font-size: var(--font-small);
      }
      .input-box {
        display: flex;
        input {
          flex-grow: 1;
          font-size: var(--font-default);
          border-radius: 2px 0px 0px 2px;
          border-width: 1px 0px 1px 1px;
          border-style: solid;
          border-color: rgba(147, 128, 108, 0.25);
          padding: 0px 0.5rem;
          height: 2rem;
        }
        button {
          border-radius: 0px 2px 2px 0px;
          border: 1px solid rgba(147, 128, 108, 0.25);
          padding: 0px 0.5rem;
          background-color: rgba(147, 128, 108, 0.1);
          color: rgb(102, 102, 102);
          cursor: pointer;
          &:hover {
            filter: brightness(120%) saturate(120%);
          }
        }
      }
    }
  }
}

body.dark-mode {
  .post-highlights-list,
  .tags,
  .message {
    background-color: rgb(26, 25, 25);
    color: rgb(238, 238, 238);
    li a:hover {
      background-color: var(--gray-darker);
    }
  }
  .tags {
    &-list {
      &-item:hover {
        background-color: var(--gray-darker);
      }
    }
  }
}
</style>
