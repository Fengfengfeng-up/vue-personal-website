<template>
  <div
    class="input-box"
    :class="{ child: rootId !== '' && rootId !== id }"
    @click.stop
  >
    <slot />
    <div class="right">
      <div class="box" :class="{ focus: focus || value }">
        <div
          ref="input"
          class="needsclick rich-input"
          contenteditable="true"
          spellcheck="false"
          disabled="disabled"
          :placeholder="placeholder"
          @input="handleInput"
          @focus="handleFocus"
        />
      </div>
      <div v-show="focus || value" class="option">
        <span
          class="btn"
          :class="{ disabled: !value }"
          @click="submit"
        ><svg-icon
          width="20"
          height="20"
          icon="send"
        /></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputBox',
  inject: ['comment'],
  props: {
    placeholder: {
      type: String,
      default: 'comments...'
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number],
      default: ''
    },
    visitorId: {
      type: [String, Number],
      default: ''
    },
    rootId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      focus: false, // 是否聚焦
      value: '',
      computedWidth: 0
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (this.autofocus) {
        // 自动聚焦
        this.$refs.input.focus()
      }

      this.$watch('comment.focusId', (id) => {
        // 监听当前聚焦的输入框id变化
        if (id !== this.id) {
          this.close()
        }
      })
    },
    handleInput(e) {
      this.value = e.target.innerText
    },
    submit() {
      // 提交评论或回复
      if (!this.value) return

      const data = {
        content: this.value,
        callback: () => {
          this.reset()
        }
      }

      if (this.rootId !== '') {
        // 子评论或回复
        data['parentId'] = this.rootId
      }

      if (this.visitorId !== '') {
        // 回复人id
        data['replyId'] = this.visitorId
      }

      this.comment.$emit('submit', data)
    },
    reset() {
      // 重置
      this.$refs.input.innerHTML = ''
      this.value = ''
      this.close()
    },
    handleFocus() {
      // 聚焦
      this.comment.focusId = this.id
      this.focus = true
    },
    close() {
      // 关闭输入框
      if (!this.focus) return
      if (!this.value) {
        this.focus = false
        this.comment.removeInputBox(this.id)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.input-box {
  width: 100%;
  padding: 0.5rem;
  display: flex;
  align-items: flex-start;
  // background-color: #2b2b2b;
  background-color: var(--blue-darker);
  border-radius: 5px;
  .right {
    width: 100%;
    .box {
      width: 100%;
      border-radius: 3px;
      background-color: var(--gray-lightest);
      border: 1px solid var(--gray-dark);
      .rich-input {
        position: relative;
        max-width: 100%;
        padding: 0.45rem 0.5rem;
        font-size: var(--font-smaller);
        outline: none;
        touch-action: none;
        color: initial;

        &:empty::before {
          content: attr(placeholder);
          opacity: 0.4;
          pointer-events: none;
          user-select: none;
        }
        &:enabled:before {
          content: none;
        }
      }
      &.focus {
        border-color: var(--yellow);
      }
    }
    .option {
      margin-top: 0.4rem;
      text-align: right;
      .btn {
        padding: 0.2rem 1rem;
        color: var(--white);
        cursor: pointer;
        display: inline-block;
        border-radius: 3px;
        background-color: var(--yellow);
        transition: opacity 0.3s;
        &:hover {
          background-color: var(--yellow-dark);
        }
        &.disabled {
          opacity: 0.4;
        }
      }
    }
  }
}
</style>
