<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
    <ToTop v-if="showToTop" />
  </div>
</template>

<script>
import ToTop from '@c/ToTop'
export default {
  components: { ToTop },
  computed: {
    showToTop({ $route }) {
      return ['BlogDetail', 'Cat'].includes($route.name)
    }
  }
}
</script>
