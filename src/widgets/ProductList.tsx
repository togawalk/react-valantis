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
    { name: 'price', label: 'Цена', value: '' }
  ]);


  const [selectedFilterMethod, setSelectedFilterMethod] = useState(inputValues[1].name)
  const [searchFilter, setSearchFilter] = useState<Filter>(null)
  const [page, setPage] = useState(1)
  const debouncedPage = useDebounce(page)


  async function fetchProducts(page: number, filter?: Filter) {
    const skip = (page - 1) * PRODUCTS_PER_PAGE;
    let products

    if (filter) {
      const idsResponse = await fetchData.getIdsWithFilter(filter)
      products = await fetchData.getProducts(trimAndLimitArray(idsResponse, skip, 50))
    } else {
      const idsResponse = await fetchData.getIds(skip)
      products = await fetchData.getProducts(trimAndLimitArray(idsResponse, 0, 50))
    }
    return products
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = event.target;
    const updatedInputValues = inputValues.map((item, i) =>
      i === index ? { ...item, value } : item
    );
    setInputValues(updatedInputValues);
  };

  const handleSearch = async () => {
    const activeFilter = inputValues.find((input) => input.name === selectedFilterMethod) || { value: '', name: '' };
    if (activeFilter.value.trim() === "") {
      setSearchFilter(null);
      setPage(1);
      return;
    }
    let filterObject;
    switch (activeFilter.name) {
      case "price":
        let parsedPrice = parseFloat(activeFilter.value);
        if (!isNaN(parsedPrice)) {
          filterObject = { price: parsedPrice }
        } else {
          setPage(1);
          return;
        }
        break;
      case "brand":
        filterObject = { brand: activeFilter.value }
        break;
      case "product":
        filterObject = { product: activeFilter.value }
        break;
      default:
        return;
    }

    setSearchFilter(filterObject)
    setPage(1)
  };

  const { data, isLoading, isError, error } = useQuery(['products', debouncedPage, searchFilter], () => {
    if (searchFilter) {
      return fetchProducts(debouncedPage, searchFilter)
    } else {
      return fetchProducts(debouncedPage)
    }
  })
  const products = data ?? []

  if (isError) {
    const errorData = error as Error | AxiosError;
    return <div className='flex justify-center'>
      <p className='text-foreground-lighter text-4xl font-medium'>{errorData.message}</p>
    </div>
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
              className={`${selectedFilterMethod === input.name ? 'bg-gray-200' : ''} w-full p-3 rounded-md ${input.name === 'price' ? 'col-span-2' : 'col-span-4'}`}
            >
              <label
                className={`block mb-2 text-sm cursor-pointer ${selectedFilterMethod === input.name ? 'font-semibold text-foreground' : 'font-medium text-foreground-lighter'}`}
              >
                {input.label}
              </label>
              <input
                id={input.name}
                className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100 disabled:cursor-not-allowed'
                disabled={selectedFilterMethod !== input.name}
                value={input.value}
                onChange={(event) => handleInputChange(event, index)}
              />
            </div>
          ))}
          <div className='p-3 col-span-2'>
            <button
              onClick={handleSearch}
              className='bg-blue-600 indigo-600 text-white text-sm leading-6 font-semibold px-6 rounded-lg w-full h-[42px] shadow-sm'>
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
            onClick={() => setPage((p) => p - 1)}
            disabled={!(page - 1) || isLoading}
            className='h-8 w-8 flex justify-center items-center hover:bg-card-hover disabled:text-foreground-lighter disabled:bg-card-alternative disabled:cursor-not-allowed'
          >
            <MdNavigateBefore className='h-6 w-6' />
          </button>
          <button

            disabled={isLoading}
            onClick={() => setPage((p) => p + 1)}
            className='h-8 w-8 flex justify-center items-center hover:bg-card-hover disabled:text-foreground-lighter disabled:bg-card-alternative disabled:cursor-not-allowed'
          >
            <MdNavigateNext className='h-6 w-6' />
          </button>
        </div>
      </div>
      <div className='mt-8'>

        {isLoading && (
          <div className='py-12 px-4 flex items-center justify-center flex-col bg-card ring-1 ring-black/[.05] rounded-lg shadow'>
            <CgSpinner className="h-6 w-6 mr-2 animate-spin" />
          </div>
        )}
        {isError && <span>{error}</span>}

        {(products?.length == 0 && !isLoading) && (
          <div className='flex items-center justify-center min-h-48 from-card to-transparent bg-gradient-to-r rounded border-dashed border-2'>
            <p className='text-foreground-light text-xl font-medium'>Нет данных</p>
          </div>
        )}
        {(products.length !== 0) && <Table data={data} columns={['ID', 'Название', 'Цена', 'Бренд']} />}
        <p className='mt-2 text-foreground-lighter italic text-end'>страница: {debouncedPage}</p>
      </div>
    </div>
  )
}
