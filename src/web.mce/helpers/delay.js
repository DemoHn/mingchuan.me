export default function delay(time_in_ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time_in_ms)
  })
}
