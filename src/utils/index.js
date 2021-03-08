import dayjs from 'dayjs'

/**
 * 格式化时间
 * @param {Date} time
 * @param {object} options
 * @returns {string}
 */
export function formatTime(time, options = {}) {
  const { interval = true, format = 'YYYY/MM/DD' } = options

  if (!interval) {
    return dayjs(time).format(format)
  }

  const year = dayjs().diff(dayjs(time), 'y')
  const month = dayjs().diff(dayjs(time), 'M')
  const day = dayjs().diff(dayjs(time), 'd')

  if (year >= 0) {
    if (year > 0 && Math.abs(month) <= 2) {
      return `${month > 0 ? 'over' : ''} ${year} year${year > 1 ? 's' : ''} ago`
    }

    if (month < 0) {
      return `${12 - Math.abs(month)} months ago`
    }

    if (month > 10) {
      // almost
      return `${year + 1} years ago`
    } else return `${month} month${month > 1 ? 's' : ''} ago`
  }

  if (Math.abs(month) !== 0) {
    if (Math.abs(day) <= 2) {
      return `${day > 0 ? 'over' : ''} ${month} month${month > 1 ? 's' : ''} ago`
    }

    if (day > 25) {
      // almost
      return `${month + 1} months ago`
    }
  }

  if (day === 0) {
    const hour = dayjs().diff(dayjs(time), 'h')
    if (hour === 0) {
      const minute = dayjs().diff(dayjs(time), 'm')
      if (minute >= 1) {
        return `${minute} minute${minute > 1 ? 's' : ''} ago`
      }
      return 'just now'
    }

    return `${hour} hour${hour > 1 ? 's' : ''} ago`
  }

  return `${Math.abs(day)} days ago`
}

/**
 * 防抖
 * @param {Function} callback 回调函数
 * @param {number} delay 延迟，默认500ms
 * @param {boolean} immediate 是否执行第一次，默认执行
 */
export function debounce(callback, delay = 500, immediate = true) {
  let timer = null
  return function() {
    if (timer) clearTimeout(timer)

    if (immediate) {
      if (!timer) callback.apply(this, arguments)
      timer = setTimeout(() => {
        timer = null
      }, delay)
    } else {
      timer = setTimeout(() => {
        callback.apply(this, arguments)
      }, delay)
    }
  }
}

/**
 * 节流
 * @param {Function} callback 回调函数
 * @param {number} delay 间隔，默认500ms
 * @param {boolean} immediate 开头执行或结尾执行，默认开头
 */
export function throttle(callback, delay = 500, immediate = true) {
  let previous = 0
  let timeout
  return function() {
    if (immediate) {
      const now = Date.now()

      if (now - previous > delay) {
        callback.apply(this, arguments)
        previous = now
      }
    } else if (!immediate) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null
          callback.apply(this, arguments)
        }, delay)
      }
    }
  }
}
