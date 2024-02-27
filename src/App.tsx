import { Table } from '@/components/ui/Table'
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md'
import { useQuery } from 'react-query'
import axios from 'axios'
import { md5 } from 'js-md5'
import { getTimestamp } from './utils'

async function fetchCoins() {
  const xAuthHeader= md5(`${import.meta.env.VITE_AUTH_PASS}_${getTimestamp()}`);

  const { data: idsResponse } = await axios.post(
    `${import.meta.env.VITE_API_URL}`,
    {
      action: "get_ids",
      params: { offset: 0, limit: 100 }
    },
    {
      headers: {
        'X-Auth': xAuthHeader,
      }

    }
  )

  const { data: products } = await axios.post(
    `${import.meta.env.VITE_API_URL}`,
    {
      action: "get_items",
      params: { ids: idsResponse.result }
    },
    {
      headers: {
        'X-Auth': xAuthHeader,
      }

    }
  )
  console.log(products.result)

  return products.result
}

function App() {
  const { data, isLoading, isError } = useQuery('products', fetchCoins)

  if (isLoading) {
    return <h3>Loading</h3>
  }

  if (isError) {
    return <h3>Error</h3>
  }

  if (!data) {
    return <h3>no data</h3>
  }

  return (
    <>
      <main className='max-w-screen-lg mx-auto px-4 flex flex-col justify-center min-h-full py-16'>
        <div className='w-full flex items-end justify-between'>
          <div>
            <h1 className='font-semibold'>Товары</h1>
            <p className='mt-2 text-foreground-light text-sm'>
              Список товаров включает в себя ID, название, цену и бренд.
            </p>
          </div>
          <div className='flex shadow bg-card rounded-lg ring-1 ring-black/[.05] overflow-hidden'>
            <button className='h-8 w-8 flex justify-center items-center hover:bg-card-hover'>
              <MdNavigateBefore className='h-6 w-6' />
            </button>
            <button className='h-8 w-8 flex justify-center items-center hover:bg-card-hover'>
              <MdNavigateNext className='h-6 w-6' />
            </button>
          </div>
        </div>
        <div className='mt-8'>
          <Table data={data} columns={['hi', 'hello']} />
        </div>

        <div className='flex shadow bg-card rounded-lg ring-1 ring-black/[.05] overflow-hidden self-end mt-8'>
          <button className='h-8 w-8 flex justify-center items-center hover:bg-card-hover'>
            <MdNavigateBefore className='h-6 w-6' />
          </button>
          <button className='h-8 w-8 flex justify-center items-center hover:bg-card-hover'>
            <MdNavigateNext className='h-6 w-6' />
          </button>
        </div>
      </main>
    </>
  )
}

export default App
