<template>
  <div class="search">
    <input type="text" :placeholder="placeholder" v-on="$listeners">
    <svg-icon icon="search" class-name="search-icon" />
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: 'Search articles'
    }
  }
}
</script>

<style lang="scss" scoped>
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

body.dark-mode .search input {
  background: var(--gray-darker);
  color: #eeeeee;
}
</style>
