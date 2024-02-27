import { Tbody } from "./Tbody"
import { Thead } from "./Thead"

export const Table = ({ data, columns }: { data: any, columns: string[] }) => {
  return (
    <div className='overflow-hidden ring-1 ring-black/[.05] rounded-lg shadow'>
      <table className='min-w-full'>
        <Thead />
        <Tbody data={data} />
      </table>
    </div>
  )
}
