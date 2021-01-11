<template>
  <div class="message" :class="type">
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'info',
      validator: (value) => {
        return ['info', 'success', 'error', 'warning'].includes(value)
      }
    },
    duration: {
      type: Number,
      default: 2500
    },
    message: {
      type: String,
      default: ''
    }
  },
  created() {
    setTimeout(() => {
      this.remove()
    }, this.duration)
  }
}
</script>

<style lang="scss" scoped>
.message {
  position: fixed;
  top: 4rem;
  right: 0;
  text-align: center;
  padding: 0.7rem 1.2rem;
  border-radius: 1rem/0.6rem;
  z-index: 2;
  background: linear-gradient(to bottom, var(--blue-dark), var(--blue-darker));
  box-shadow: 0 0.5rem 0.5rem var(--blue-darker);
  border: 1px solid var(--blue);
  font-size: var(--font-default);
  color: var(--white);
  transform: translateX(-50%);
  animation: message 0.3s forwards linear;
}

@keyframes message {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  50% {
    opacity: 1;
    transform: translateX(-15%);
  }
  60% {
    transform: translateX(-8%);
  }
  70% {
    transform: translateX(-20%);
  }
  80% {
    transform: translateX(-10%);
  }
  100% {
    transform: translateX(-15%);
  }
}
</style>
