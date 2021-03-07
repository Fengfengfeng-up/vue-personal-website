<template>
  <transition-group ref="links" name="list" tag="ul">
    <li v-for="item in activeHeadings" :key="item.id" class="directory-item">
      <a
        :href="item.id"
        :class="{
          'is-active': item.id === visibleId,
          'is-child': item.depth === 3,
        }"
        @click="(e) => handleLinkClick(e, item.id)"
      >
        {{ item.title }}
      </a>
    </li>
  </transition-group>
</template>

<script>
export default {
  data() {
    return {
      visibleId: '',
      headings: [],
      compiledHeadings: []
    }
  },
  computed: {
    activeHeadings() {
      const activeItem = this.compiledHeadings.find(
        (item) => item.id === this.visibleId
      )

      const relatedItems = this.getRelated(activeItem) || []
      return this.compiledHeadings.filter(
        (item) => item.depth === 2 || relatedItems.includes(item)
      )
    }
  },
  mounted() {
    const options = {
      rootMargin: '0px 0px -200px 0px',
      threshold: 1
    }
    const debouncedFunction = this.debounce(this.handleObserver)

    this.observer = new IntersectionObserver(debouncedFunction, options)
    this.motionQuery = window.matchMedia('(prefers-reduced-motion)')
    this.findHeadings()
  },
  methods: {
    findHeadings() {
      if (this.observer) {
        this.headings = [...document.body.querySelectorAll('h2[id], h3[id]')]
        this.compileHeadings(this.headings)
        this.headings.map((heading) => this.observer.observe(heading))
      }
    },
    compileHeadings(list) {
      this.compiledHeadings = list.map((h) => {
        return {
          title: h.innerText,
          depth: +h.nodeName.replace(/\D/g, ''),
          id: `#${h.getAttribute('id')}`
        }
      })
    },
    getRelated(item) {
      if (item) {
        const items = this.compiledHeadings
        const currentIdx = items.indexOf(item)
        let idx = 0

        // find the correct (parent) index
        if (item.depth === 2) {
          idx = currentIdx + 1
        } else {
          // find parent index
          let found = false
          for (let j = currentIdx; j >= 0; j--) {
            if (items[j].depth === 2 && !found) {
              idx = j + 1
              found = true
            }
          }
        }

        const children = []
        let isSameLevel = true
        for (idx; idx < items.length; idx++) {
          if (items[idx].depth === 3 && isSameLevel) {
            children.push(items[idx])
          } else if (items[idx].depth === 2) {
            isSameLevel = false
          }
        }
        return children
      }
    },
    handleObserver(entries, observer) {
      entries.forEach((entry) => {
        const { target, isIntersecting, intersectionRatio } = entry
        if (isIntersecting && intersectionRatio >= 1) {
          this.visibleId = `#${target.getAttribute('id')}`
        }
      })
    },
    handleLinkClick(evt, itemId) {
      evt.preventDefault()
      const id = itemId.replace('#', '')
      const section = this.headings.find(
        (heading) => heading.getAttribute('id') === id
      )
      section.setAttribute('tabindex', -1)
      section.focus()
      this.visibleId = itemId

      window.scroll({
        behavior: this.motionQuery.matches ? 'instant' : 'smooth',
        top: section.offsetTop - 80,
        block: 'start'
      })
    },
    debounce(fn) {
      var timeout
      return function() {
        var context = this
        var args = arguments
        if (timeout) {
          window.cancelAnimationFrame(timeout)
        }
        timeout = window.requestAnimationFrame(function() {
          fn.apply(context, args)
        })
      }
    }
  }
}
</script>

<style scoped>
.directory-item {
  padding-bottom: .3rem;
}

.is-active {
  font-weight: 600;
  color: var(--yellow-dark);
}

.is-child {
  padding-left: 1em;
  font-weight: normal;
}

.list-leave-active,
.list-move {
  transition: transform 0.8s, opacity 0.4s;
}

.list-enter-active {
  transition: transform 0.8s ease 0.4s, opacity 0.4s ease 0.4s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.list-leave-active {
  position: absolute;
}
</style>
