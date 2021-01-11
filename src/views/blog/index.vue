<template>
  <div ref="blog" class="blog">
    <h1>Blog</h1>
    <div class="search">
      <input
        type="text"
        aria-label="Search articles"
        placeholder="Search articles"
        @input="searchBlogs"
      >
      <svg-icon icon="search" class-name="search-icon" />
    </div>
    <h2>
      {{
        searchValue
          ? blogs.length + ' Article Matches'
          : total + ' Total Articles'
      }}
    </h2>
    <blog-list :data="blogs" />
    <router-view />
  </div>
</template>

<script>
import BlogList from './components/BlogList'
export default {
  name: 'Blog',
  components: { BlogList },
  data() {
    return {
      blogs: [],
      total: '',
      searchValue: ''
    }
  },
  created() {
    this.getBlogs()
  },
  methods: {
    async getBlogs() {
      try {
        const res = await this.$http('/blogs/list')
        this.blogs = res.data
        this.cache = res.data
        this.total = res.total
      } catch (err) {
        console.log(err)
      }
    },
    searchBlogs(e) {
      const value = e.target.value.trim()

      if (value === '') {
        this.blogs = this.cache
        return
      }

      this.blogs = this.cache.filter((v) => v.title.indexOf(value) > -1)
      this.searchValue = value
    }
  }
}
</script>

<style lang="scss" scoped>
.blog {
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
body.dark-mode .blog .search input {
  background: var(--gray-darker);
  color: rgb(238, 238, 238);
}
</style>
