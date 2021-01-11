<template>
  <div class="comment">
    <h2>评论</h2>
    <input-box id="0" class="computed-width">
      <img src="../../assets/image/comment.png">
    </input-box>
    <comment-list v-if="data" :data="data" />
  </div>
</template>

<script>
import InputBox from './components/InputBox'
import CommentList from './components/CommentIist'
export default {
  name: 'Comment',
  components: { InputBox, CommentList },
  provide() {
    return {
      comment: this
    }
  },
  props: {
    data: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  data() {
    return {
      boxs: [],
      focusId: ''
    }
  },
  mounted() {
    window.addEventListener('click', this.reset)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('click', this.reset)
    })
  },
  methods: {
    reset() {
      if (this.focusId === '') return
      this.focusId = ''
      this.globalBlur(this)
    },
    addInputBox(id) {
      // 点击回复按钮

      if (id === this.focusId) {
        this.focusId = ''
        this.removeInputBox(id)
        return
      }

      this.focusId = id
      if (!this.boxs.includes(id)) {
        this.boxs.push(id)
        this.$nextTick(() => {
          const inputBoxSize =
            5 * (16 + (6 * (document.documentElement.clientWidth - 326)) / 680)
          window.scrollBy({
            top: inputBoxSize,
            behavior: 'smooth'
          })
        })
      }
    },
    removeInputBox(id) {
      // 移除评论输入框
      const index = this.boxs.indexOf(id)
      if (index > -1) {
        this.boxs.splice(index, 1)
      }
    },
    globalBlur(target = this) {
      // 全局失焦，递归执行评论输入框的close方法
      const children = target.$children

      if (children.length > 0) {
        children.map((c) => this.globalBlur(c))
      } else {
        if (target.close) {
          target.close()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.comment {
  margin-top: 2rem;
  & > .comment-list {
    padding: 0.5rem 0;
  }
  img {
    margin-right: 0.5rem;
    width: 1.8rem;
    height: 1.8rem;
    min-width: auto;
  }
  .computed-width {
    ::v-deep .right {
      width: calc(100% - 2.1875rem - 0.5rem);
    }
  }
}

body.light-mode .comment {
  & > .comment-list {
    background-color: var(--white);
  }
}
</style>
