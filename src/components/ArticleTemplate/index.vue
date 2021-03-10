<template>
  <div class="article">
    <div ref="article" v-html="article.html" />
    <Directory v-if="article.html" class="directory" />
    <Relation :prev="article.prev" :next="article.next" />
    <Comment
      v-if="isBlog"
      :data="article.comments"
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
import Info from './components/Info'
import Relation from './components/Relation'
import Directory from './components/Directory'
import Comment from '@c/Comment'
import hljs from 'highlight.js'
export default {
  name: 'ArticleTemplate',
  components: { Directory, Relation, Comment },
  inheritAttrs: false,
  inject: ['app'],
  props: {
    id: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      article: {}
    }
  },
  computed: {
    isBlog({ $route }) {
      return $route.name === 'BlogDetail'
    }
  },
  watch: {
    id: {
      immediate: true,
      async handler(id) {
        this.article = this.$route.params.article || (await this.getArticle(id))
        this.init(this.article)
      }
    }
  },
  methods: {
    init({ title, author, words, createAt, type }) {
      if (!title) return

      this.$setTitle(title)
      this.$nextTick(() => {
        this.$refs.article
          .querySelectorAll('pre code')
          .forEach((block) => hljs.highlightBlock(block))

        if (this.isBlog) {
          this.addInfoComponent({ author, words, createAt })
        }
      })
    },
    addInfoComponent(data) {
      const _Vue = Object.getPrototypeOf(this.$root).constructor // 获取Vue构造函数
      const _Info = _Vue.extend(Info)
      const infoDom = new _Info({ propsData: { data }}).$mount().$el // 拿到基础信息组件挂载后的DOM

      const ArticleDom = this.$refs.article
      const afterTitle = ArticleDom.querySelector('h1').nextSibling
      ArticleDom.insertBefore(infoDom, afterTitle) // 将基础信息组件DOM插入到标题之后
    },
    async getArticle(id) {
      const url = `/blogs/${this.isBlog ? '' : 'leetcode/'}${id}`
      try {
        const res = await this.$http(url)
        return res.data
      } catch (err) {
        console.log(err)
      }
    },
    async submitComment({ callback, ...params }) {
      if (!this.app.getSrc('token')) {
        // 未登录
        this.$message({ message: '请先登陆' })
        this.$login()
        return
      }

      try {
        const blogId = this.article.id
        const res = await this.$http.post('/comments/create', {
          ...params,
          blogId
        })

        const comment = res.data
        const parentId = params.parentId

        if (parentId === undefined) {
          // 一级评论
          this.article.comments.push(comment)
        } else {
          this.article.comments.forEach((c) => {
            if (c.id === parentId) {
              if (!c.childrenComments) {
                c.childrenComments = []
              }
              c.childrenComments.push(comment)
              return
            }
          })
        }

        callback()

        const message = (params.parentId ? '回复' : '评论') + '成功！'
        this.$message({ message })
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
    }
  }
}
</script>

<style scoped>
.directory {
  min-width: 15rem;
  list-style: none;
  padding: 0.5rem;
  padding-left: 1.5rem;
  border-left: 5px solid var(--blue-dark);
  font-size: 1.05rem;
  color: var(--blue-dark);
  position: fixed;
  top: 6rem;
  right: 3%;
}

@media screen and (max-width: 1000px) {
  .directory {
    display: none;
  }
}

@media screen and (min-width: 1300px) {
  .directory {
    right: 8%;
  }
}
</style>
