interface Product {
  id: string,
  name: string,
  price: number,
  brand: string
}

interface Products extends Array<Product> { }


export const Tbody = ({ data }: { data: Products }) => {
  return (

    <tbody className='bg-card'>
      {data.map((product) => {
        return (
          <tr
            className='border-b cursor-pointer hover:bg-card-hover'
            key={product.id}
          >
            <td className='pl-6 pr-3 py-4'>
              12d19cdd-a58a-41bf-b387-3c8c3d08a40a
            </td>
            <td className='py-4 px-3'>Золотое кольцо с бриллиантами</td>
            <td className='px-3'>16700.0</td>
            <td className='pl-3 pr-6'>Piaget</td>
          </tr>
        )
      })}
    </tbody>
  )
}
