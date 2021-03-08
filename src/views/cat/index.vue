<template>
  <div class="cat">
    <Header v-once />
    <div class="top">
      <div class="top-background" />
      <section>
        <h1>
          What's up! This is Xiaoqi, nice to meet you~
        </h1>
        <!--         <div class="search">
          <input
            :value="searchValue"
            placeholder="呆头鹅"
            class="search-cat"
            type="text"
            @input="(e) => (searchValue = e.target.value.trim())"
          >
          <svg-icon icon="search" class-name="search-icon" />
        </div> -->
      </section>
    </div>
    <!-- <div class="cat-tags" /> -->
    <div class="img-container">
      <h1>All Of Me 😺</h1>
      <vue-masonry-wall
        :items="cats"
        :options="{ width: 400, padding: 12 }"
        @append="getCats"
      >
        <template #default="{ item }">
          <div class="cat-item">
            <img
              :src="item.file"
              :title="`${item.title} | ${item.summary}`"
              :alt="`${item.title} | ${item.summary}`"
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
                <a
                  :class="{ liked: item._liked }"
                  @click="likeCat(item)"
                ><svg-icon
                  icon="heart"
                /></a>
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
      // searchValue: ''
    }
  },
  methods: {
    async getCats() {
      if (this.isEmpty) return

      try {
        const { data, total } = await this.$http('cats/list', {
          params: {
            page: PAGE++,
            size: SIZE
          }
        })

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
      try {
        await this.$http.patch(`/cats/${cat.id}`)
        cat._liked = !cat._liked
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
      background-image: url(https://cdn.striveforus.com/IMG_7583.JPG);
      background-size: contain;
      background-position: center center;
    }
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: -webkit-gradient(
          linear,
          left top,
          left bottom,
          from(rgba(0, 0, 0, 0.2)),
          to(rgba(0, 0, 0, 0.2))
        ),
        -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.2)), to(transparent));
      background: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0.2) 0%,
          rgba(0, 0, 0, 0.2) 100%
        ),
        linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, transparent 100%);
      z-index: 1;
    }
    section {
      z-index: 2;
      color: var(--white);
      width: 100%;
      max-width: 750px;
      h1 {
        font-size: 2.1rem;
        line-height: 1.4;
      }
      /* .search {
        position: relative;
        input {
          width: 100%;
          font-size: var(--font-small);
          padding: 0.8rem 4rem 0.8rem 1rem;
          border-radius: 0.5rem;
          outline: none;
          border: none;
        }
        &-icon {
          color: var(--gray-darker);
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
        }
      } */
    }
  }
  .img-container {
    max-width: var(--maxWidth);
    margin: 0 auto;
    user-select: none;
    h1 {
      text-align: center;
    }
    .cat-item {
      position: relative;
      &::before {
        content: '';
        pointer-events: none;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 5px;
        height: 3rem;
        background: linear-gradient(
          to top,
          rgba(0, 0, 0, 0.5) 0%,
          transparent 100%
        );
        opacity: 0;
        transition: opacity 0.2s;
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;
        z-index: 1;
      }
      &:hover {
        &::before {
          opacity: 1;
          transition-delay: 0.1s;
        }
        .img-info {
          opacity: 1;
          transition-delay: 0.1s;
        }
      }
      .img-info {
        position: absolute;
        bottom: 5px;
        left: 0;
        width: 100%;
        padding: 0.6rem 1.2rem;
        color: var(--white);
        display: flex;
        align-items: center;
        justify-content: space-between;
        opacity: 0;
        z-index: 2;
        span,
        a {
          opacity: 0.8;
          background-image: none;
          &:hover {
            opacity: 1;
          }
          &.liked {
            color: red;
            opacity: 1;
          }
        }
        a {
          cursor: pointer;
        }
        a:first-child {
          margin-right: 1rem;
        }
      }
    }
  }
}
</style>
