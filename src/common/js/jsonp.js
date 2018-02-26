import originjsonp from 'jsonp'

export function jsonp (url, data, options) {
  url += (url.indexOf('?') < 0 ? '?' : '') + params(data)
  return new Promise((resolve, reject) => {
    originjsonp(url, options, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(new Error(err))
      }
    })
  })
}

/**
 * {a:1,b:2}
 * a=1&b=2
 */
function params (data) {
  let string = ''
  for (let k in data) {
    let value = data[k] === 'undefined' ? '' : data[k]
    string += `&${k}=${encodeURIComponent(value)}`
  }
  return string ? string.substring(1) : ''
}
