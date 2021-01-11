/**
 * 引入某目录下所有文件
 * @param {Function} context 由require.context模块上下文返回的函数
 * @param {string|Array} exclude 需要过滤的文件
 * @returns {Array}
 */
const requireAll = (context, exclude) => {
  const excludes = Array.isArray(exclude) ? exclude : [exclude]

  return context.keys().reduce((files, fileName) => {
    const name = fileName.split('/').pop().replace(/\.\w+$/, '')

    if (!excludes.includes(name)) {
      files[name] = context(fileName).default || context(fileName)
    }

    return files
  }, {})
}

export default requireAll
