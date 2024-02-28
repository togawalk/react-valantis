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
            className='border-b cursor-pointer hover:bg-card-hover'
            key={product.id}
          >
            <td className='pl-6 pr-3 py-4'>{product.id}</td>
            <td className='py-4 px-3'>{product.product}</td>
            <td className='px-3'>{product.price}</td>
            <td className='pl-3 pr-6'>{product.brand}</td>
          </tr>
        )
      })}
    </tbody>
  )
}
