export default function(name, component) {
  return {
    install() {
      const Vue = Array.prototype.shift.call(arguments)
      Vue.prototype['$' + name] = function(options) {
        generateGlobalComponent(Vue, component, options)
      }
    }
  }
}

function generateGlobalComponent(Vue, component, props) {
  const Component = Vue.extend(component)
  const instance = new Component({ propsData: props }).$mount()

  document.body.appendChild(instance.$el)

  instance.remove = () => {
    document.body.removeChild(instance.$el)
    instance.$destroy()
  }

  return instance
}
