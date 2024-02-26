const data = [
  {
    id: '12d19cdd-a58a-41bf-b387-3c8c3d08a40a',
    name: 'Золотое кольцо с бриллиантами',
    price: 2333,
    brand: '',
  },
]

export const Table = () => {
  return (
    <div className='overflow-hidden ring-1 ring-black/[.05] rounded-lg shadow'>
      <table className='min-w-full'>
        <thead className='bg-card-alternative'>
          <tr className='font-semibold text-left border-b border-black/[.15]'>
            <th className='pl-6 pr-3 py-3.5 text-foreground'>ID</th>
            <th className='text-foreground px-3 py-3.5'>Название</th>
            <th className='text-foreground px-3 py-3.5'>Цена</th>
            <th className='text-foreground pl-3 pr-6 py-3.5'>Бренд</th>
          </tr>
        </thead>
        <tbody className='bg-card'>
          {[...Array(50).keys()].map((product) => {
            {
              /* {data.map(() => { */
            }
            return (
              <tr
                className='border-b cursor-pointer hover:bg-card-hover'
                key={product}
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
      </table>
    </div>
  )
}
