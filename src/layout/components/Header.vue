<template>
  <div class="layout-header" :class="headerClass">
    <div class="nav">
      <router-link to="/" class="link logo-name">
        <img
          class="logo"
          alt="Freeisms Logo"
          src="../../assets/image/logo1.png"
        >
        <span class="name">Freeisms</span>
      </router-link>
      <div class="nav-list">
        <router-link
          v-for="item in list"
          :key="item.url"
          :to="item.url"
          class="link"
        >{{ item.label }}</router-link>
        <a class="link" href="https://fh-notebook.vercel.app/" target="_blank">Notebook</a>
      </div>
      <div class="nav-icons">
        <a
          class="link"
          @click="
            changeTheme(mode === 'light-mode' ? 'dark-mode' : 'light-mode')
          "
        >
          <svg-icon :icon="mode === 'light-mode' ? 'moon' : 'sun'" />
        </a>
        <a
          href="https://github.com/Fengfengfeng-up/vue-personal-website"
          target="_blank"
          class="link"
        >
          <svg-icon icon="github" />
        </a>
        <a
          href="https://fh-notebook.vercel.app/"
          target="_blank"
          class="link"
        >
          <svg-icon icon="notebook" />
        </a>
        <a class="link nav-menu" @click="mobileMenu = true">
          <svg-icon icon="menu" />
        </a>
      </div>
    </div>

    <!-- mobile menu and nav -->
    <div v-if="mobileMenu" class="nav_mobile">
      <a class="menu link" @click="mobileMenu = false">
        <svg-icon icon="menu" />
      </a>
      <div class="nav-list_mobile">
        <router-link
          v-for="item in list"
          :key="item.url"
          :to="item.url"
          class="link"
          @click.native="mobileMenu = false"
        >{{ item.label }}</router-link>
        <a class="link" href="https://fh-notebook.vercel.app/" target="_blank">Notebook</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mobileMenu: false,
      mode: '',
      distance: 0,
      list: [
        {
          label: 'Blog',
          url: '/blog'
        },
        {
          label: 'Cat',
          url: '/cat'
        }
      ]
    }
  },
  computed: {
    headerClass() {
      return this.$route.name + (this.distance <= 80 ? ' top-0' : '')
    }
  },
  created() {
    this.$bus.$on('change-mode', (mode) => {
      this.mode = mode
    })
    this.changeTheme(localStorage.getItem('mode') || 'dark-mode')
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.distance = Math.ceil(document.scrollingElement.scrollTop)
    })
  },
  methods: {
    changeTheme(mode) {
      if (mode === this.mode) return
      document.body.className = mode
      this.$bus.$emit('change-mode', mode)
      localStorage.setItem('mode', mode)
      return mode
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-header {
  grid-area: header;
  padding: 0 1rem;
  background-color: var(--blue-darker);
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%;
  max-width: var(--maxWidth);
  color: var(--white);
  box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
  img {
    width: 30px;
    height: 30px;
    min-width: 30px;
    max-width: 30px;
  }
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
  }
  &:before {
    background-color: var(--blue-darker);
    left: -100%;
    right: 100%;
  }
  &::after {
    background-color: var(--blue-darker);
    right: -100%;
    left: 100%;
  }
  &.Cat {
    left: 0;
    right: 0;
    margin: auto;
    .link:hover {
      background-color: initial;
      opacity: 0.7;
    }
    &.top-0 {
      background-color: transparent;
      box-shadow: none;
      &::before,
      &::after {
        background-color: transparent;
        box-shadow: none;
      }
    }
  }
}
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0px;
  max-height: 40px;
  position: relative;
  .logo-name {
    display: flex;
    align-items: center;
    .logo {
      width: 30px;
      height: 30px;
      min-width: 30px;
      max-width: 30px;
      border-radius: 50%;
      margin-right: 0.5rem;
    }
  }
  .nav-list {
    color: var(--yellow);
  }
  .nav-icons {
    display: flex;
    .nav-menu {
      display: none;
    }
  }
}
.link {
  background-image: none;
  font-weight: normal;
  background-size: initial;
  background-position: initial;
  cursor: pointer;
  padding: 0.3rem 0.5rem;
  margin-left: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 300ms ease 0s;
  svg {
    display: block;
  }
  &:first-of-type {
    margin-left: 0px;
  }
  &:hover {
    background-color: var(--blue-dark);
  }
}

.nav_mobile {
  position: fixed;
  touch-action: none;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: var(--blue-darker);
  z-index: 100;
  a {
    font-size: var(--font-large);
    margin-bottom: 2rem;
  }
  .menu {
    top: 0.6rem;
    right: 1rem;
    position: absolute;
  }
  .nav-list_mobile {
    display: grid;
    place-items: center;
    top: 50%;
    position: relative;
    transform: translateY(-50%);
    .link {
      margin-left: 0;
    }
  }
}

@media screen and (max-width: 1000px) {
  .logo-name .name,
  .nav .nav-list {
    display: none;
  }
  .nav .nav-icons .nav-menu {
    display: block;
  }
}

@media (min-width: 1000px) {
  .link {
    padding: 0.25rem 0.75rem;
    margin-left: 1rem;
  }
  .nav-list {
    display: block;
  }
}
</style>
