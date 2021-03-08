<template>
  <div id="app" :class="{ 'page-cat': $route.name === 'Cat' }">
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

<style>
#app.page-cat::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.05;
  z-index: -1;
  background-image: url('./assets/image/bg.png');
  background-size: 200px 200px;
  background-repeat: repeat;
  background-position: center center;
}
</style>
