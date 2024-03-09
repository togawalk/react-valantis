import { useState } from 'react'
import { Table } from '@/shared/ui/Table'
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md'
import { Filter, fetchData } from '@/shared/api/base'
import { CgSpinner } from 'react-icons/cg'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { trimAndLimitArray } from '@/shared/lib'
import { useQuery } from 'react-query'
import { PRODUCTS_PER_PAGE } from '@/shared/config'
import { Toaster } from 'react-hot-toast'
import { AxiosError } from 'axios'

export const ProductList = () => {
  const [inputValues, setInputValues] = useState([
    { name: 'product', label: 'Название', value: '' },
    { name: 'brand', label: 'Бренд', value: '' },
    { name: 'price', label: 'Цена', value: '' },
  ])

  const [selectedFilterMethod, setSelectedFilterMethod] = useState(
    inputValues[1].name
  )
  const [searchFilter, setSearchFilter] = useState<Filter>(null)
  const [page, setPage] = useState(1)
  const debouncedPage = useDebounce(page)

  async function fetchProducts(page: number, filter?: Filter) {
    const skip = (page - 1) * PRODUCTS_PER_PAGE
    let products

    if (filter) {
      const idsResponse = await fetchData.getIdsWithFilter(filter)
      products = await fetchData.getProducts(
        trimAndLimitArray(idsResponse, skip, 50)
      )
    } else {
      const idsResponse = await fetchData.getIds(skip)
      products = await fetchData.getProducts(
        trimAndLimitArray(idsResponse, 0, 50)
      )
    }
    return products
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = event.target
    const updatedInputValues = inputValues.map((item, i) =>
      i === index ? { ...item, value } : item
    )
    setInputValues(updatedInputValues)
  }

  const handleSearch = async () => {
    const activeFilter = inputValues.find(
      (input) => input.name === selectedFilterMethod
    ) || { value: '', name: '' }
    if (activeFilter.value.trim() === '') {
      setSearchFilter(null)
      setPage(1)
      return
    }
    let filterObject
    switch (activeFilter.name) {
      case 'price':
        let parsedPrice = parseFloat(activeFilter.value)
        if (!isNaN(parsedPrice)) {
          filterObject = { price: parsedPrice }
        } else {
          setPage(1)
          return
        }
        break
      case 'brand':
        filterObject = { brand: activeFilter.value }
        break
      case 'product':
        filterObject = { product: activeFilter.value }
        break
      default:
        return
    }

    setSearchFilter(filterObject)
    setPage(1)
  }

  const { data, isLoading, isError, error } = useQuery(
    ['products', debouncedPage, searchFilter],
    () => {
      if (searchFilter) {
        return fetchProducts(debouncedPage, searchFilter)
      } else {
        return fetchProducts(debouncedPage)
      }
    }
  )
  const products = data ?? []

  if (isError) {
    const errorData = error as Error | AxiosError
    return (
      <div className='flex justify-center'>
        <p className='text-4xl font-medium text-foreground-lighter'>
          {errorData.message}
        </p>
      </div>
    )
  }

  return (
    <div>
      <Toaster />
      <section>
        <fieldset className='grid w-full grid-cols-12 items-end'>
          {inputValues.map((input, index) => (
            <div
              key={input.name}
              onClick={() => setSelectedFilterMethod(input.name)}
              className={`${selectedFilterMethod === input.name ? 'bg-gray-200' : ''} w-full rounded-md p-3 ${input.name === 'price' ? 'col-span-2' : 'col-span-4'}`}
            >
              <label
                className={`mb-2 block cursor-pointer text-sm ${selectedFilterMethod === input.name ? 'font-semibold text-foreground' : 'font-medium text-foreground-lighter'}`}
              >
                {input.label}
              </label>
              <input
                id={input.name}
                className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100'
                disabled={selectedFilterMethod !== input.name}
                value={input.value}
                onChange={(event) => handleInputChange(event, index)}
              />
            </div>
          ))}
          <div className='col-span-2 p-3'>
            <button
              onClick={handleSearch}
              className='indigo-600 h-[42px] w-full rounded-lg bg-blue-600 px-6 text-sm font-semibold leading-6 text-white shadow-sm'
            >
              Искать
            </button>
          </div>
        </fieldset>
      </section>

      <div className='mt-8 flex w-full items-end justify-between'>
        <div>
          <h1 className='font-semibold'>Товары</h1>
          <p className='mt-2 text-sm text-foreground-light'>
            Список товаров включает в себя ID, название, цену и бренд.
          </p>
        </div>
        <div className='flex overflow-hidden rounded-lg bg-card shadow ring-1 ring-black/[.05]'>
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={!(page - 1) || isLoading}
            className='flex h-8 w-8 items-center justify-center hover:bg-card-hover disabled:cursor-not-allowed disabled:bg-card-alternative disabled:text-foreground-lighter'
          >
            <MdNavigateBefore className='h-6 w-6' />
          </button>
          <button
            disabled={isLoading}
            onClick={() => setPage((p) => p + 1)}
            className='flex h-8 w-8 items-center justify-center hover:bg-card-hover disabled:cursor-not-allowed disabled:bg-card-alternative disabled:text-foreground-lighter'
          >
            <MdNavigateNext className='h-6 w-6' />
          </button>
        </div>
      </div>
      <div className='mt-8'>
        {isLoading && (
          <div className='flex flex-col items-center justify-center rounded-lg bg-card px-4 py-12 shadow ring-1 ring-black/[.05]'>
            <CgSpinner className='mr-2 h-6 w-6 animate-spin' />
          </div>
        )}
        {isError && <span>{error}</span>}

        {products?.length == 0 && !isLoading && (
          <div className='flex min-h-48 items-center justify-center rounded border-2 border-dashed bg-gradient-to-r from-card to-transparent'>
            <p className='text-xl font-medium text-foreground-light'>
              Нет данных
            </p>
          </div>
        )}
        {products.length !== 0 && (
          <Table data={data} columns={['ID', 'Название', 'Цена', 'Бренд']} />
        )}
        <p className='mt-2 text-end italic text-foreground-lighter'>
          страница: {debouncedPage}
        </p>
      </div>
    </div>
  )
}
