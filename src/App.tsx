import { Table } from '@/components/ui/Table'
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md'
import { useQuery } from 'react-query'
import axios from 'axios'
import { md5 } from 'js-md5'
import { getTimestamp, removeDuplicates, removeDuplicatesWithSet } from './utils'
import { useState } from 'react'

async function fetchCoins(skip: number) {
  const xAuthHeader = md5(`${import.meta.env.VITE_AUTH_PASS}_${getTimestamp()}`)

  let { data: idsResponse } = await axios.post(
    `${import.meta.env.VITE_API_URL}`,
    {
      action: 'get_ids',
      params: { offset: skip, limit: 5 },
    },
    {
      headers: {
        'X-Auth': xAuthHeader,
      },
    }
  )
  idsResponse = removeDuplicates(idsResponse.result)

  const { data: products } = await axios.post(
    `${import.meta.env.VITE_API_URL}`,
    {
      action: 'get_items',
      params: { ids: idsResponse },
    },
    {
      headers: {
        'X-Auth': xAuthHeader,
      },
    }
  )
  console.log(idsResponse)
  console.log(products)

  return products.result
}

function App() {
  const [selectedFilterMethod, setSelectedFilterMethod] = useState('product')
  const [page, setPage] = useState(0)
  const { data, isLoading, isError } = useQuery(['products', page], () => fetchCoins(page))

  if (isError) {
    return <h3>Error</h3>
  }

  const filterBy: { value: string; label: string }[] = [
    { value: 'product', label: 'Название' },
    { value: 'brand', label: 'Бренд' },
    { value: 'price', label: 'Цена' },
  ]

  return (
    <>
      <main className='max-w-screen-lg mx-auto px-4 min-h-full py-16'>
        <section>
          <fieldset className='grid w-full grid-cols-12 items-end'>
            {filterBy.map((item) => (
              <div
                className={`${selectedFilterMethod === item.value ? 'bg-gray-200' : ''} w-full p-3 rounded-md ${item.value === 'price' ? 'col-span-2' : 'col-span-4'}`}
              >
                <label
                  className={`block mb-2 text-sm cursor-pointer ${selectedFilterMethod === item.value ? 'font-semibold text-foreground' : 'font-medium text-foreground-lighter'}`}
                  onClick={() => setSelectedFilterMethod(item.value)}
                >
                  {item.label}
                </label>
                <input
                  id={item.value}
                  className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100 disabled:cursor-not-allowed'
                  disabled={(selectedFilterMethod !== item.value ? true : false)}
                />

              </div>
            ))}
            <div className='p-3 col-span-2'>
              <button className='bg-blue-600 indigo-600 text-white text-sm leading-6 font-semibold px-6 rounded-lg w-full h-[42px] shadow-sm'>
                Искать
              </button>
            </div>
          </fieldset>
        </section>

        <div className='w-full flex items-end justify-between mt-8'>
          <div>
            <h1 className='font-semibold'>Товары</h1>
            <p className='mt-2 text-foreground-light text-sm'>
              Список товаров включает в себя ID, название, цену и бренд.
            </p>
          </div>
          <div className='flex shadow bg-card rounded-lg ring-1 ring-black/[.05] overflow-hidden'>
            <button
              onClick={() => setPage((p) => p - 10)}
              className='h-8 w-8 flex justify-center items-center hover:bg-card-hover'>
              <MdNavigateBefore className='h-6 w-6' />
            </button>
            <button
              onClick={() => setPage((p) => p + 10)}
              className='h-8 w-8 flex justify-center items-center hover:bg-card-hover'>
              <MdNavigateNext className='h-6 w-6' />
            </button>
          </div>
        </div>
        <div className='mt-8'>
          {isLoading ? (
            'loading'
          ) : (
            <Table data={data} columns={['hi', 'hello']} />
          )}


        </div>

      </main>
    </>
  )
}

export default App
