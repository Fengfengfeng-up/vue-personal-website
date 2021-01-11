<template>
  <div class="comment-list" :class="{ child: rootId !== '' }">
    <div
      v-for="(item, i) in data"
      :key="item.createAt + i"
      class="comment-list-item"
    >
      <img class="avatar" src="../../../assets/image/logo.png">
      <div
        class="right"
        :class="{
          focus: comment.boxs.includes(item.id) && i !== data.length - 1,
        }"
      >
        <div class="base">
          <span v-if="item.visitor" :title="item.visitor.email">{{
            item.visitor.name + (item.visitor.id === 1 ? '（作者）' : '')
          }}</span>
          &emsp;
        </div>
        <div class="content">
          <span
            v-if="item.reply"
          >回复
            <span
              class="pointer"
              style="color: #406599"
              :title="item.reply.email"
            >{{ item.reply.name + '：' }}</span></span>{{ item.content }}
        </div>
        <div class="desc">
          <div
            class="desc-left"
            :title="$formatTime(item.createAt, { interval: false })"
          >
            {{ $formatTime(item.createAt).replace(/about|almost/, '') }}
          </div>
          <div class="desc-right">
            <div :class="{ liked: item.liked }">
              <svg-icon
                width="16"
                height="16"
                icon="like"
                @click.native="comment.$emit('like', item)"
              />
              {{ item.like || '' }}
            </div>
            <div @click.stop="comment.addInputBox(item.id)">
              <svg-icon
                icon="pencil"
                width="16"
                height="16"
              />
            </div>
          </div>
        </div>
        <input-box
          v-if="comment.boxs.includes(item.id)"
          :id="item.id"
          :visitor-id="
            (rootId || $parent.rootId || item.id) !== item.id
              ? item.visitor.id
              : ''
          "
          :root-id="rootId || $parent.rootId || item.id"
          autofocus
        />
        <comment-list
          v-if="item.childrenComments && item.childrenComments.length > 0"
          :data="item.childrenComments"
          :root-id="item.id"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InputBox from './InputBox'
export default {
  inject: ['comment'],
  name: 'CommentList',
  components: { InputBox },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    rootId: {
      type: [String, Number],
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-list {
  border-radius: 5px;
  ::v-deep img {
    user-select: none;
    -webkit-user-drag: none;
    width: 2.1875rem;
    height: 2.1875rem;
    min-width: auto;
    border-radius: 50%;
  }
  &.child {
    padding-bottom: 0.3rem;
    .comment-list-item {
      margin-top: 0;
      padding-top: 0.8rem;
      background-color: #fafbfc;
      &:last-child {
        margin-bottom: 0.5rem;
        .right {
          border-bottom: none;
        }
      }
    }
  }
  &-item {
    margin-top: 0.7rem;
    padding: 0 0.6rem;
    display: flex;
    align-items: flex-start;
    &:not(:last-child) {
      .right {
        transition: border-color 0.3s;
        border-bottom: 1px solid #f1f1f1;
      }
    }
    .right {
      max-width: calc(100% - 2.1875rem - 0.625rem);
      flex: 1;
      margin-left: 0.5rem;
      .base {
        font-size: var(--font-small);
        cursor: pointer;
      }
      .content {
        padding: 0.5rem 0;
        width: 100%;
        line-height: 1.5;
        font-size: var(--font-small);
        overflow-wrap: break-word;
      }
      &.focus {
        padding-bottom: 0.5rem;
      }
    }
    .desc {
      user-select: none;
      padding-bottom: 0.8rem;
      display: flex;
      justify-content: space-between;
      font-size: var(--font-smaller);
      .desc-left {
        color: var(--gray-dark);
      }
      .desc-right {
        display: flex;
        min-width: 6rem;
        justify-content: space-between;
        & > div {
          cursor: pointer;
          display: flex;
          align-items: center;
          &:hover {
            opacity: 0.7;
          }
          &:first-child {
            width: 3rem;
            &.liked {
              opacity: 0.5;
            }
            svg {
              margin-right: 0.3rem;
            }
          }
          &:last-child {
            margin-right: 1rem;
          }
        }
      }
    }
  }
}

body.dark-mode .comment-list .comment-list-item .right .input-box {
  background-color: var(--gray-dark);
}

body.dark-mode .comment-list {
  .comment-list-item {
    &:not(:last-child) {
      .right {
        border-bottom: 1px solid var(--blue-darker);
      }
    }
  }
  .child .comment-list-item {
    background-color: inherit;
    &:last-child {
      .right {
        border-bottom: none;
      }
    }
  }
}
</style>
