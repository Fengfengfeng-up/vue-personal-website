<template>
  <div ref="article" class="article">
    <h1>{{ isBlog ? 'Blog' : 'LeetCode' }}</h1>
    <Search @input="searchArticles" />
    <h2>{{ countMessage }}</h2>
    <ArticleList :type="isBlog ? 'blog' : 'leetcode'" :data="articles" />
  </div>
</template>

<script>
import Search from '@c/Search'
import ArticleList from '@c/ArticleTemplate/components/List'
export default {
  name: 'Article',
  components: { ArticleList, Search },
  beforeRouteUpdate(to, from, next) {
    this.filterArticles(to.query.tagId)
    next()
  },
  data() {
    return {
      articles: [],
      cache: [],
      total: '',
      searchValue: ''
    }
  },
  computed: {
    countMessage({ $route, searchValue, articles, total, isBlog }) {
      const name = isBlog ? 'Article' : 'Problems'
      return searchValue || $route.query.tagId
        ? `${articles.length} ${name} Matches`
        : `${total} Total ${name}`
    },
    isBlog({ type, $route }) {
      return /blog/.test($route.path)
    }
  },
  watch: {
    isBlog: {
      immediate: true,
      handler: 'getArticles'
    }
  },
  methods: {
    async getArticles() {
      try {
        const url = this.isBlog ? '/blogs/list' : '/blogs/leetcode'
        const res = await this.$http(url)

        this.articles = res.data
        this.cache = res.data
        this.total = res.total
        this.filterArticles(this.$route.query.tagId)
      } catch (err) {
        console.log(err)
      }
    },
    filterArticles(id) {
      if (!id) {
        this.articles = this.cache
      } else {
        this.articles = this.cache.filter((article) =>
          article.tags.some((t) => t.id === +id)
        )
      }
    },
    searchArticles(e) {
      const value = e.target.value.trim()

      if (value === '') {
        this.articles = this.cache
      } else {
        this.articles = this.cache.filter((v) => v.title.indexOf(value) > -1)
        this.searchValue = value
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.article {
  .search {
    position: relative;
    input {
      width: 100%;
      display: flex;
      align-items: center;
      position: relative;
      transition: all 0.2s ease 0s;
      outline: none;
      appearance: none;
      font-size: 1rem;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      height: 2rem;
      border-radius: 0.25rem;
      border-image: initial;
      border-width: 1px;
      border-style: solid;
      border-color: inherit;
      background-color: rgb(255, 255, 255);
    }
    &-icon {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
body.dark-mode .article .search input {
  background: var(--gray-darker);
  color: rgb(238, 238, 238);
}
</style>
