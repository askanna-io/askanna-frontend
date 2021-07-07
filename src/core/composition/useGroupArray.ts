export default () => (myArray: any[], chunk_size: number) => {
  const results = []

  while (myArray.length) {
    results.push(myArray.splice(0, chunk_size))
  }

  return results
}
