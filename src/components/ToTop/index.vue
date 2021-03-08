<template>
  <div ref="to-top-btn" class="to-top" @click="ToTop">
    <div>Top</div>
    <svg class="to-top-svg">
      <circle
        ref="to-top-border"
        class="to-top-border"
        cx="50%"
        cy="50%"
        r="48%"
        :style="{ 'stroke-dasharray': borderLen }"
      />
    </svg>
  </div>
</template>
<script>
export default {
  data() {
    return {
      borderLen: '0% 314.15926%'
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.$refs['to-top-btn'].addEventListener('touch', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    this.$refs['to-top-btn'].removeEventListener('touch', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const currentTop = window.pageYOffset
      const docuHeight = document.body.offsetHeight
      const windowHeight = document.documentElement.clientHeight

      let percent = (currentTop / (docuHeight - windowHeight)) * 100
      if (percent > 100) percent = 100

      if (isNaN(percent) || Math.round(percent) <= 0) {
        percent = 0
      }

      this.borderLen = 3.1415926 * (percent || 0) + '% 314.15926%'
    },
    ToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$wider: 0.375rem;
$to-top-btn-size: 2.5rem;
.to-top {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--yellow-dark);
  color: var(--blue-darker);
  border-radius: 50%;
  text-align: center;
  line-height: 2.5rem;
  font-size: var(--font-smaller);
  font-weight: 600;
  cursor: pointer;
  &-svg {
    position: absolute;
    bottom: (-$wider / 2);
    right: (-$wider / 2);
    width: $to-top-btn-size + $wider;
    height: $to-top-btn-size + $wider;
  }
  &-border {
    stroke: var(--blue);
    opacity: 0.9;
    stroke-width: 1px;
    fill: none;
    transform: (rotate(-90deg));
    transform-origin: 50% 50%;
    stroke-dasharray: 0% 314.15926%;
  }
}

@media screen and (min-width: 1000px) {
  .to-top {
    display: none;
  }
}
</style>
