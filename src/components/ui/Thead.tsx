export const Thead = () => {
  return (

    <thead className='bg-card-alternative'>
      <tr className='font-semibold text-left border-b border-black/[.15]'>
        <th className='pl-6 pr-3 py-3.5 text-foreground'>ID</th>
        <th className='text-foreground px-3 py-3.5'>Название</th>
        <th className='text-foreground px-3 py-3.5'>Цена</th>
        <th className='text-foreground pl-3 pr-6 py-3.5'>Бренд</th>
      </tr>
    </thead>
  )
}
