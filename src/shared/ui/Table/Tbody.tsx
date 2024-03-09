interface Product {
  id: string
  product: string
  price: number
  brand: string
}

interface Products extends Array<Product> {}

export const Tbody = ({ data }: { data: Products }) => {
  return (
    <tbody className='bg-card'>
      {data.map((product) => {
        return (
          <tr
            className='cursor-pointer border-b hover:bg-card-hover'
            key={product.id}
          >
            <td className='px-3 py-4'>{product.id}</td>
            <td className='px-3 py-4'>{product.product}</td>
            <td className='px-3 py-4'>{product.price}</td>
            <td className='px-3 py-4'>{product.brand}</td>
          </tr>
        )
      })}
    </tbody>
  )
}
