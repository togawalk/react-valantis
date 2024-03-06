import { useState, useEffect } from 'react'
import { Table } from '@/components/ui/Table'
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md'
import { fetchData } from '@/utils/fetch'
import { CgSpinner } from 'react-icons/cg'
import { useDebounce } from '@/hooks'


export const ProductList = () => {
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const [filter, setFilter] = useState('')
  const [selectedFilterMethod, setSelectedFilterMethod] = useState('product')
  const [page, setPage] = useState(0)
  const debouncedPage = useDebounce(page)


  if (isError) {
    return <h3>Error</h3>
  }

  const filterBy: { value: string; label: string }[] = [
    { value: 'product', label: 'Название' },
    { value: 'brand', label: 'Бренд' },
    { value: 'price', label: 'Цена' },
  ]

  async function fetchProducts(skip: number) {
    setIsLoading(true)
    const idsResponse = await fetchData.getIds(skip)
    const products = await fetchData.getProducts(idsResponse)
    setData(products)
    setIsLoading(false)

    return products
  }

  useEffect(() => {
    const products = fetchProducts(debouncedPage)

  }, [debouncedPage])

  return (
    <div>
      <section>
        <fieldset className='grid w-full grid-cols-12 items-end'>
          {filterBy.map((item) => (
            <div
              key={item.value}
              onClick={() => setSelectedFilterMethod(item.value)}
              className={`${selectedFilterMethod === item.value ? 'bg-gray-200' : ''} w-full p-3 rounded-md ${item.value === 'price' ? 'col-span-2' : 'col-span-4'}`}
            >
              <label
                className={`block mb-2 text-sm cursor-pointer ${selectedFilterMethod === item.value ? 'font-semibold text-foreground' : 'font-medium text-foreground-lighter'}`}
              >
                {item.label}
              </label>
              <input
                id={item.value}
                className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100 disabled:cursor-not-allowed'
                disabled={selectedFilterMethod !== item.value ? true : false}
                value={filter}
                onChange={event => setFilter(event.target.value)}
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
            disabled={!page}
            className='h-8 w-8 flex justify-center items-center hover:bg-card-hover disabled:text-foreground-lighter disabled:bg-card-alternative disabled:cursor-not-allowed'
          >
            <MdNavigateBefore className='h-6 w-6' />
          </button>
          <button
            onClick={() => setPage((p) => p + 10)}
            className='h-8 w-8 flex justify-center items-center hover:bg-card-hover'
          >
            <MdNavigateNext className='h-6 w-6' />
          </button>
        </div>
      </div>
      <div className='mt-8'>
        {isLoading ? (
          <div className='py-12 px-4 flex items-center justify-center flex-col bg-card ring-1 ring-black/[.05] rounded-lg shadow'>
            <CgSpinner className="h-6 w-6 mr-2 animate-spin" />
          </div>
        ) : (
          <Table data={data} columns={['hi', 'hello']} />
        )}
      </div>
    </div>
  )
}
