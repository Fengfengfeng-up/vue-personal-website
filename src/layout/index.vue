<template>
  <div class="layout">
    <Header />
    <div class="layout-content">
      <keep-alive exclude="BlogDetail">
        <router-view />
      </keep-alive>
    </div>
    <SideBar v-show="$route.meta.slideBar" />
    <Footer v-once />
    <ToTop v-once />
  </div>
</template>

<script>
import Header from './components/Header'
import Footer from './components/Footer'
import SideBar from './components/SideBar'
import ToTop from './components/ToTop'
export default {
  components: { Header, Footer, SideBar, ToTop },
  provide() {
    const that = this
    return {
      app: {
        getSrc() {
          return that.getResource.apply(this, arguments)
        },
        setSrc() {
          return that.setResource.apply(this, arguments)
        }
      }
    }
  },
  data() {
    return {
      token: localStorage.getItem('token'),
      profile: JSON.parse(
        localStorage.getItem('profile') ||
          '{"name": "", "email": "", "avatar": ""}'
      )
    }
  },
  created() {
    this.$bus.$on('setResource', (data) => this.setResource(data))
  },
  mounted() {
    document.documentElement.firstChild.removeChild(
      document.querySelector('style')
    )
  },
  methods: {
    setResource({ name, data }) {
      this[name] = data
      localStorage.setItem(name, JSON.stringify(data))
    },
    getResource(name) {
      return this[name] || JSON.parse(localStorage.getItem(name))
    }
  }
}
</script>

<style lang="scss" scoped>
.layout {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 57px auto 1fr 57px;
  grid-template-areas: 'header' 'content' 'sidebar' 'footer';
  min-height: 100%;
  margin: 0 auto;
  max-width: var(--maxWidth);
}

@media (min-width: 1000px) {
  .layout {
    grid-template-columns: auto calc(320px + 2rem);
    grid-template-rows: 57px minmax(200px, 300px) auto 57px;
    grid-template-areas: 'header  header' 'content sidebar' 'content auto' 'footer  footer';
  }
  .layout-sidebar {
    margin-left: -1rem;
    // transform: translateY(6rem);
  }
}

.layout-content {
  grid-area: content;
  min-width: 0;
  padding: 0 1rem;
  min-height: 100vh;
}
</style>
