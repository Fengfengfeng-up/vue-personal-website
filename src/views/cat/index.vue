<template>
  <div class="cat">
    <Header v-once />
    <div class="top">
      <div class="top-background" />
      <section>
        <h1>
          "Taking the sourest lemon that life has to offer and turning it into
          something resembling lemonade."
          <div class="quote">- This Is Us</div>
        </h1>
      </section>
    </div>
    <div class="img-container">
      <h1>小七 & 十一 😺</h1>
      <vue-masonry-wall
        :items="cats"
        :options="{ width: 400, padding: 12 }"
        @append="getCats"
      >
        <template #default="{ item }">
          <div tag="div" class="cat-item">
            <img
              :src="item.file"
              :title="`${item.title}`"
              :alt="`${item.title}`"
            >
            <div class="img-info">
              <span>{{ item.time }}</span>
              <div>
                <a
                  :href="item.file"
                  target="_blank"
                ><svg-icon
                  icon="download"
                /></a>
                <div :class="{ liked: item._liked }" class="like">
                  <a @click="likeCat(item)"><svg-icon icon="heart" /></a>
                  <span v-show="item.likes > 0">{{ item.likes }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </vue-masonry-wall>
    </div>
  </div>
</template>

<script>
import Header from '@/layout/components/Header'
import VueMasonryWall from 'vue-masonry-wall'

let PAGE = 1
const SIZE = document.body.clientWidth > 680 ? 10 : 5
export default {
  components: { VueMasonryWall, Header },
  data() {
    return {
      cats: [],
      isEmpty: false
    }
  },
  methods: {
    async getCats() {
      if (this.isEmpty) return

      try {
        const { data, total } = await this.$http(
          'cats/list',
          {
            params: {
              page: PAGE++,
              size: SIZE
            }
          },
          false
        )

        data.forEach((c) => (c._liked = false))
        this.cats.push(...data)

        if (this.cats.length >= total) {
          this.isEmpty = true
        }
      } catch (err) {
        console.log(err)
      }
    },
    async likeCat(cat) {
      if (cat._liked) return
      try {
        await this.$http(`/cats/${cat.id}`, { method: 'patch' }, false)
        cat._liked = !cat._liked
        cat.likes++
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// @mixin webp($url, $type) {
//   background-image: url($url+'.'+$type);
//   background-repeat: no-repeat;
//   background-size: cover;
//   @at-root .webpa & {
//     background-image: url($url+'.webp');
//   }
// }
.cat {
  width: 100vw;
  min-height: calc(100vh + 1px);
  .top {
    width: 100%;
    overflow: hidden;
    height: 75vh;
    min-height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    position: relative;
    .top-background {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      overflow: hidden;
      // @include webp('../../assets/image/cat', 'png');
      background-image: url('../../assets/image/bg.png');
      background-size: 10rem;
      opacity: 0.2;
    }
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0.2) 0%,
          rgba(0, 0, 0, 0.2) 100%
        ),
        linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, transparent 100%);
      z-index: 1;
    }
    section {
      position: relative;
      z-index: 2;
      color: var(--white);
      width: 100%;
      max-width: 750px;
      h1 {
        font-size: 2rem;
        line-height: 1.5;
        .quote {
          margin-top: 1.5rem;
          font-size: 1.5rem;
          text-align: right;
          color: var(--gray-light);
        }
      }
    }
  }
  .img-container {
    max-width: var(--maxWidth);
    margin: 0 auto;
    user-select: none;
    h1 {
      text-align: center;
      padding: 2rem 0 1rem;
    }
    .cat-item {
      position: relative;
      cursor: pointer;
      img {
        border-radius: 0.3rem;
      }
      &:hover {
        .img-info {
          opacity: 1;
          transition-delay: 0.1s;
          &::after {
            opacity: 1;
            transition-delay: 0.1s;
          }
        }
      }
      .img-info {
        position: absolute;
        pointer-events: none;
        bottom: 4.8px;
        left: 0;
        width: 100%;
        padding: 0.6rem 1.2rem;
        color: var(--white);
        display: flex;
        align-items: center;
        justify-content: space-between;
        opacity: 0;
        border-bottom-left-radius: 0.3rem;
        border-bottom-right-radius: 0.3rem;
        overflow: hidden;
        &::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 3rem;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.5) 0%,
            transparent 100%
          );
          opacity: 0;
          transition: opacity 0.2s;
        }
        div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          &.like {
            a {
              margin-right: 0.2rem;
            }
            &.liked {
              color: var(--yellow);
            }
          }
        }
        span,
        a {
          opacity: 0.8;
          background-image: none;
          &:hover {
            opacity: 1;
          }
        }
        a {
          cursor: pointer;
          margin-right: 1rem;
        }
      }
    }
  }
}

body.dark-mode {
  .cat .top {
    background-color: var(--gray-dark);
    &-background {
      opacity: 1;
    }
  }
}
</style>
