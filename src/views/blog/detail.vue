<template>
  <div class="blog">
    <div ref="blog" v-html="html" />
    <Comment
      v-if="blog"
      :data="blog.comments"
      @submit="submitComment"
      @like="likeComment"
    />
  </div>
</template>

<script>
// import 'highlight.js/styles/ir-black.css'
// import 'highlight.js/styles/monokai-sublime.css'
// import 'highlight.js/styles/monokai.css'
// import 'highlight.js/styles/qtcreator_dark.css'
import BlogInfo from './components/BlogInfo'
import Comment from '@c/Comment'
import hljs from 'highlight.js'
export default {
  name: 'BlogDetail',
  components: { Comment },
  inject: ['app'],
  props: {
    id: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      blog: {
        title: ''
      },
      html: ''
    }
  },
  watch: {
    id: {
      immediate: true,
      handler(id) {
        if (typeof +id !== 'number' || isNaN(+id)) {
          this.$router.replace('/blog')
          return
        }

        this.blog = this.$route.params.blog
        if (!this.blog) {
          this.getBlog(id)
          return
        }
      }
    },
    blog: {
      immediate: true,
      handler(blog) {
        if (blog && Object.keys(blog).length > 0) {
          this.$setTitle(blog.title)
          this.html = blog.html
          this.$nextTick(() => {
            this.addComponents(blog)
            this.$refs.blog.querySelectorAll('pre code').forEach((block) => {
              hljs.highlightBlock(block)
            })
          })
        }
      }
    }
  },
  methods: {
    addComponents({ author, words, createAt }) {
      const _Vue = Object.getPrototypeOf(this.$root).constructor // 获取Vue构造函数
      const _BlogInfo = _Vue.extend(BlogInfo)
      const data = { author, words, createAt }
      const infoDom = new _BlogInfo({ propsData: { data }}).$mount().$el // 拿到基础信息组件挂载后的DOM

      const blogDom = this.$refs.blog
      const afterTitle = blogDom.querySelector('h1').nextSibling
      blogDom.insertBefore(infoDom, afterTitle) // 将基础信息组件DOM插入到标题之后
    },
    async submitComment({ callback, ...params }) {
      if (!this.app.getSrc('token')) {
        // 未登录
        this.$message({ message: '请先登陆' })
        this.$login()
        return
      }

      try {
        const blogId = this.blog.id
        const res = await this.$http.post('/comments/create', {
          ...params,
          blogId
        })
        const comment = res.data

        const parentId = params.parentId
        if (parentId === undefined) {
          // 一级评论
          this.blog.comments.push(comment)
        } else {
          this.blog.comments.forEach((c) => {
            if (c.id === parentId) {
              c.childrenComments.push(comment)
              return
            }
          })
        }
        callback()
        this.$message({
          message: (params.parentId ? '回复' : '评论') + '成功！'
        })
      } catch (err) {
        console.log(err)
      }
    },
    async likeComment(comment) {
      if (comment.liked) return

      try {
        await this.$http.patch(`/comments/like/${comment.id}`)
        comment.like++
        comment.liked = true
      } catch (err) {
        console.log(err)
      }
    },
    async getBlog(id) {
      try {
        const res = await this.$http(`/blogs/${id}`)
        this.blog = res.data
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
