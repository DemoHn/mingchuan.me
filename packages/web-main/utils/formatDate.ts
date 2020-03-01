const padZero = (num: number) => (num < 10 ? `0${num}` : `${num}`)

export function formatDate(date: Date, type?: string) {
  const YYYY = date.getFullYear()
  const MM = padZero(date.getMonth() + 1)
  const DD = padZero(date.getDate())
  const HH = padZero(date.getHours())
  const mm = padZero(date.getMinutes())

  switch (type) {
    case 'HHmm':
      return `${HH}:${mm}`
    case 'MMDDHHmm':
      return `${MM}-${DD} ${HH}:${mm}`
    default:
      return `${YYYY}-${MM}-${DD} ${HH}:${mm}`
  }
}

export function displayTimestamp(target: number, current: number) {
  const showDate = new Date(target)
  const currentDate = new Date(current)

  var displayTime = ''
  if (showDate.getFullYear() === currentDate.getFullYear()) {
    if (
      showDate.getMonth() === currentDate.getMonth() &&
      showDate.getDate() === currentDate.getDate()
    ) {
      displayTime = formatDate(showDate, 'HHmm')
    } else {
      displayTime = formatDate(showDate, 'MMDDHHmm')
    }
  } else {
    //// YYYY-MM-DD mm:ss
    displayTime = formatDate(showDate)
  }
  return displayTime
}