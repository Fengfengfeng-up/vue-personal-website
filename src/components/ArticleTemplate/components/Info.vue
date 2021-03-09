<template>
  <div class="info">
    <div class="left">
      <img
        alt="Avatar"
        src="../../../assets/image/avatar.jpg"
        style="width: 30px; height: 30px; min-width: auto;"
      >
      <span>{{ data.author.name }}</span>
      <span class="point">•</span>
      <span
        :title="$formatTime(data.createAt, { interval: false })"
        class="time"
      >
        <svg-icon icon="date" width="16" height="16" />
        <span>{{ $formatTime(data.createAt) }}</span></span>
    </div>
    <div class="right">
      <svg-icon icon="pen" width="16" height="16" />
      <span>{{ data.words }} words</span>
      <span class="point">•</span>
      <svg-icon icon="clock" width="16" height="16" />
      <span>{{ readTime(data.words) }} min read</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    readTime(words) {
      return Math.round(words / 200) || 1
    }
  }
}
</script>

<style lang="scss" scoped>
.info {
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  padding: 0px 0.75rem;
  color: var(--gray-dark);
  font-size: var(--font-smaller);
  margin: -0.5rem 0px 1rem;
  flex-wrap: wrap;
  .left {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    img {
      width: 30px;
      height: 30px;
      min-width: auto;
      border-radius: 50%;
      margin-right: 0.5rem;
      border: 1px solid var(--gray);
    }
    .time {
      display: flex;
      -webkit-box-align: center;
      align-items: center;
    }
  }
  .right {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
  }
  svg {
    margin-right: 0.5rem;
  }
  .point {
    margin: 0px 0.5rem;
  }
}
</style>
