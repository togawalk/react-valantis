export const Thead = ({ columns }: { columns: string[] }) => {
  return (
    <thead className='bg-card-alternative'>
      <tr className='border-b border-black/[.15] text-left font-semibold'>
        {columns.map((column) => {
          return (
            <th key={column} className='px-3 py-3.5 text-foreground'>
              {column}
            </th>
          )
        })}
      </tr>
    </thead>
  )
}
