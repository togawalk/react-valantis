export const Thead = ({ columns }: { columns: string[] }) => {
  return (
    <thead className='bg-card-alternative'>
      <tr className='font-semibold text-left border-b border-black/[.15]'>
        {columns.map((column) => {
          return (
            <th key={column} className='text-foreground px-3 py-3.5'>
              {column}
            </th>
          )
        })}
      </tr>
    </thead>
  )
}
