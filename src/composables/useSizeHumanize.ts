export default function () {
  const humanizeSize = (fileSizeInBytes: number) => {
    if (typeof fileSizeInBytes === 'undefined') {
      return
    }
    if (fileSizeInBytes === 0) {
      return '0 KB'
    }
    let i = -1
    const byteUnits = [' KB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB']
    do {
      fileSizeInBytes = fileSizeInBytes / 1024
      i++
    } while (fileSizeInBytes > 1024)

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i]
  }

  return { humanizeSize }
}
