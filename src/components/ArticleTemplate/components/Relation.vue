<template>
  <div v-if="prev || next" class="relation">
    <div
      v-for="(item, index) in [prev, next]"
      v-show="item"
      :key="index"
      :class="index ? 'next' : 'prev'"
    >
      <template v-if="item">
        <span class="prefix">{{ index ? '下一篇' : '上一篇' }}：</span>
        <router-link
          :to="{
            name: $parent.isBlog ? 'BlogDetail' : 'LeetCodeDetail',
            params: { id: item.id },
          }"
        >{{ item.title }}</router-link>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    prev: {
      type: Object,
      default: null
    },
    next: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.relation {
  border-top: 3px solid var(--blue-darker);
  color: var(--blue-dark);
  padding: 0.4rem 0;
  margin-top: 2rem;
  .prev,
  .next {
    padding: 0.5rem 0;
  }
  .prefix {
    color: var(--blue-dark);
  }
}
</style>
