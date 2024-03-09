import { Tbody } from './Tbody'
import { Thead } from './Thead'

export const Table = ({ data, columns }: { data: any; columns: string[] }) => {
  return (
    <div className='overflow-hidden rounded-lg shadow ring-1 ring-black/[.05]'>
      <table className='min-w-full'>
        <Thead columns={columns} />
        <Tbody data={data} />
      </table>
    </div>
  )
}
