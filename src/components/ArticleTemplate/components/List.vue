<template>
  <ul class="article-list">
    <li v-for="(item, i) in data" :key="i" class="article-list-item dark">
      <router-link
        tag="div"
        :to="{
          name: `${isBlog ? 'BlogDetail' : 'LeetCodeDetail'}`,
          params: { id: item.id, article: item },
        }"
      >
        <div class="top">
          <h3>{{ item.title }}</h3>
          <span
            :title="$formatTime(item.createAt, { interval: false })"
            class="date"
          >
            <svg-icon icon="date" width="16" height="16" />
            <span>{{ $formatTime(item.createAt) }}</span></span>
        </div>
        <div v-if="isBlog" class="middle">
          <p>{{ item.intro }}</p>
        </div>
        <div class="bottom">
          <span
            v-for="tag in filterTag(item.tags)"
            :key="tag.name + tag.id"
            class="tag"
            :style="getTagColor(tag.name)"
          >
            {{ tag.name }}
          </span>
        </div>
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'blog'
    }
  },
  computed: {
    isBlog({ type }) {
      return type === 'blog'
    }
  },
  methods: {
    filterTag(tags) {
      const skips = ['LeetCode']
      return tags.filter((t) => !skips.includes(t.name))
    },
    getTagColor(name) {
      const color =
        name === '简单'
          ? '#009975'
          : name === '中等'
            ? '#ed7336'
            : name === '困难'
              ? '#ec4c47'
              : '#888'
      return `--color: ${color}`
    }
  }
}
</script>

<style lang="scss" scoped>
.article-list {
  list-style: none;
  padding: 0px;
  .article-list-item {
    display: block;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: rgba(0, 0, 0, 0.075) 0px 0.125rem 0.25rem;
    margin-bottom: 1rem;
    transition: transform 0.5s ease 0s;
    position: relative;
    background: transparent;
    & > div {
      cursor: pointer;
    }
    &:nth-child(2n + 1) {
      background: var(--gray-lightest);
    }
    &:hover {
      background: var(--gray-lightest);
      transform: translateY(-2px);
      box-shadow: rgba(0, 0, 0, 0.15) 0px 0.5rem 1rem;
    }
    &::after {
      content: 'draft';
      position: absolute;
      right: 1rem;
      bottom: 1rem;
      font-size: var(--font-small);
      background-color: var(--yellow);
      color: var(--gray-darker);
      padding: 0.25rem 0.5rem;
      border-radius: 0.5rem;
      display: none;
    }
    .top {
      display: flex;
      -webkit-box-pack: justify;
      justify-content: space-between;
      -webkit-box-align: baseline;
      align-items: baseline;
      h3 {
        margin: 0px 0.5rem 1rem 0;
      }
      .date {
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        font-size: var(--font-small);
        color: var(--gray--dark);
        white-space: nowrap;
        svg {
          margin-right: 0.5rem;
        }
      }
    }
    .middle p {
      margin: 0 0 1rem;
    }
    .bottom {
      .tag {
        font-size: var(--font-smaller);
        margin-right: 0.3rem;
        color: var(--color);
      }
    }
  }
}

body.dark-mode .article-list .dark:nth-child(2n + 1) {
  background: var(--gray-darker);
}
body.dark-mode .article-list .dark:hover {
  background: var(--gray-darker);
}

body.dark-mode .article-list .dark .date {
  color: var(--gray);
}
</style>
