interface Product {
  id: string
  price: number
  product: string
  brand: string | null
}

export function getTimestamp() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '')
}

export function removeProductDuplicates(arr: Product[]) {
  const seenIds: { [id: string]: boolean } = {}
  return arr.filter((item) => {
    if (!seenIds[item.id]) {
      seenIds[item.id] = true
      return true
    }
    return false
  })
}
