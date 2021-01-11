<template>
  <div class="home">
    <div class="intro">
      <div class="intro-left">
        <h1>
          {{ text }}
        </h1>
        <div class="link">
          <a
            href="https://fff-website.oss-cn-chengdu.aliyuncs.com/IMG_7130%2820201105-155843%29.JPG"
            target="_blank"
            title="Wechat"
          >
            <svg-icon
              icon="wechat"
              width="32"
              height="32"
            /></a>
          <a
            href="https://fff-website.oss-cn-chengdu.aliyuncs.com/IMG_7129%2820201105-155632%29.JPG"
            target="_blank"
            title="QQ"
          >
            <svg-icon
              icon="qq"
              width="32"
              height="32"
            /></a>
          <!-- <a href="" title="Video">
            <svg-icon icon="vedio" width="32" height="32" />
          </a> -->
          <a
            href="https://github.com/Fengfengfeng-up"
            target="_blank"
            title="GitHub"
          >
            <svg-icon
              icon="github"
              width="32"
              height="32"
            /></a>
        </div>
        <input
          id="verbosity"
          class="range-top"
          aria-label="Verbosity"
          type="range"
          min="0"
          max="2"
          step="1"
          :value="verbosity"
          @input="rangeInput"
        >
        <Intro :verbosity="verbosity" />
      </div>
      <div class="intro-rigth">
        <img
          width="200"
          height="200"
          alt="Avatar"
          src="../../assets/image/avatar.jpg"
        >
        <label for="verbosity">Verbosity</label>
        <input
          id="verbosity"
          class="range"
          type="range"
          min="0"
          max="2"
          step="1"
          :value="verbosity"
          @input="rangeInput"
        >
      </div>
    </div>
    <div class="lastest-content">
      <h2>最新文章</h2>
      <blog-list :data="content" />
    </div>
  </div>
</template>
<script>
import BlogList from '../blog/components/BlogList'
import Intro from './components/Intro'
export default {
  name: 'Home',
  components: { BlogList, Intro },
  data() {
    return {
      verbosity: 1,
      content: [],
      text: ''
    }
  },
  created() {
    // 判断屏幕宽度是否大于500px
    const isLargeDevice = getComputedStyle(document.body, '::before').content === `"largeDevice"`
    this.init({ matches: isLargeDevice })
    this.getLastestContent()

    // 监听屏幕宽度改变
    const largeDevice = window.matchMedia('(min-width: 500px)')
    largeDevice.addEventListener('change', this.init)
  },
  methods: {
    init({ matches }) {
      if (matches) {
        this.verbosity = 2
        this.text = "👋 Hey, I'm Neal Feng"
      } else {
        this.verbosity = 1
        this.text = '👋 Neal Feng'
      }
    },
    rangeInput(e) {
      const value = Number(e.target.value)
      this.verbosity = value
    },
    async getLastestContent() {
      try {
        const res = await this.$http('/blogs/list', {
          params: { page: 1, size: 6 }
        })
        this.content = res.data
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  .intro {
    margin-top: 1rem;
    color: white;
    padding: 1rem;
    display: flex;
    border-radius: 1rem;
    flex-direction: column;
    justify-content: space-around;
    box-shadow: rgba(0, 0, 0, 0.075) 0px 0.125rem 0.25rem;
    background-image: linear-gradient(
      120deg,
      var(--blue-darker) 0%,
      var(--blue-dark) 100%
    );

    .intro-left {
      -webkit-box-flex: 1;
      flex-grow: 1;
      h1 {
        margin-top: 0px;
      }
      .link {
        display: flex;
        justify-content: space-evenly;
        a {
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          background-image: none;
          transition: background-color 300ms ease-in-out 0s;
          &:hover {
            background-color: var(--blue-dark);
          }
        }
      }
    }

    .intro-rigth {
      flex-shrink: 0;
      margin: 0px 0px 0px 1rem;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      flex-direction: column;
      img {
        border-radius: 50%;
        width: 200px;
        height: 200px;
        min-width: auto;
        display: block;
        margin-bottom: 1rem;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 3px 2px;
      }
      label {
        font-size: var(--font-small);
      }
    }
  }
  .lastest-content {
    position: relative;
  }
}

input[type='range'] {
  width: 100%;
  height: 34px;
  margin-top: 10px;
  margin-bottom: 1.5rem;
  background-color: transparent;
  &.range-top {
    margin-bottom: 10px;
  }
}

@media screen and (min-width: 1100px) {
  .home .intro {
    flex-direction: row;
  }
  .home .intro .intro-left .range-top {
    display: none;
  }
}

@media screen and (max-width: 1100px) {
  .home .intro .intro-rigth {
    display: none;
  }
}
</style>
