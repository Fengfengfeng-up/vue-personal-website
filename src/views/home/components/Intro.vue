<template>
  <div class="desc">
    <p v-if="verbosity === 0">
      👨‍💻😺📚🎲✍
    </p>
    <p v-else-if="verbosity === 1">
      A man with a 😺 cat. 👨‍💻 Junior Front-End Dev focusing on
      <a target="_blank" href="https://cn.vuejs.org/">Vue</a>
      in Kunming. likes 📚 reading and 🎲 gaming.
    </p>
    <p v-else-if="verbosity === 2">
      I am from
      <a
        target="_blank"
        href="https://baike.baidu.com/item/%E9%87%8D%E5%BA%86/23586"
      >Chongqing</a>
      and currently living in
      <a
        target="_blank"
        href="https://baike.baidu.com/item/%E6%98%86%E6%98%8E/161012"
      >Kunming</a>
      with a 😺 cat. I'm a 👨‍💻 Junior Front-End Web Developer primarily focusing
      on the
      <svg-icon icon="vue" class-name="vue-icon" /> &nbsp;
      <a target="_blank" href="https://cn.vuejs.org/">Vue</a>
      ecosystem. In my free time, I prefer to read 📚 books and play 🎲 games. I
      also enjoy ✍ blogging and sharing with the things I learn. And I believe
      that all things are difficult before they are easy.
    </p>
  </div>
</template>

<script>
export default {
  props: {
    verbosity: {
      type: Number,
      default: 1
    }
  }
}
</script>

<style lang="scss" scoped>
.desc p {
  margin-bottom: 0px;
  .vue-icon {
    width: 1.1rem;
    height: 1.1rem;
    background: var(--blue-darker);
    border: 2px solid #000;
    margin-bottom: -0.1rem;
  }
}
</style>
