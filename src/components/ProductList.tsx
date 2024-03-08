import { useState, useEffect } from 'react'
import { Table } from '@/components/ui/Table'
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md'
import { Filter, fetchData } from '@/shared/api/base'
import { CgSpinner } from 'react-icons/cg'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { trimAndLimitArray } from '@/shared/lib'
import { Product } from '@/shared/lib/removeProductDuplicates'


export const ProductList = () => {
  const [data, setData] = useState<Product[]>()
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const [inputValues, setInputValues] = useState([
    { name: 'product', label: 'Название', value: '' },
    { name: 'brand', label: 'Бренд', value: '' },
    { name: 'price', label: 'Цена', value: '' }
  ]);


  const [selectedFilterMethod, setSelectedFilterMethod] = useState(inputValues[1].name)
  const [searchFilter, setSearchFilter] = useState()
  const [page, setPage] = useState(1)
  const debouncedPage = useDebounce(page)


  if (isError) {
    return <h3>Error</h3>
  }

  async function fetchProducts(page: number, filter?: Filter) {
    setIsLoading(true)
    const itemsPerPage = 5;
    const skip = (page - 1) * itemsPerPage;
    let products

    if (filter) {
      const idsResponse = await fetchData.getIdsWithFilter(filter)
      products = await fetchData.getProducts(trimAndLimitArray(idsResponse, skip, 5))
    } else {
      const idsResponse = await fetchData.getIds(skip)
      products = await fetchData.getProducts(idsResponse)
    }


    console.log(products)
    setData(products)
    setIsLoading(false)

    return products
  }

  const handleInputChange = (event, index) => {
    const { value } = event.target;
    const updatedInputValues = inputValues.map((item, i) =>
      i === index ? { ...item, value } : item
    );
    setInputValues(updatedInputValues);
  };

  const handleSearch = async () => {
    const activeFilter = inputValues.find((input) => input.name === selectedFilterMethod);
    const filterObject = {
      [activeFilter.name]: activeFilter.value
    };
    const filter = activeFilter && activeFilter.value.trim() !== '' ? filterObject : undefined;
    if (filter.hasOwnProperty('price')) {
      const priceValue = filter['price'];
      const parsedPrice = parseFloat(priceValue);
      if (!isNaN(parsedPrice)) {
        filter['price'] = parsedPrice;
      }

    }

    if (filter) {
      setSearchFilter(filter)
    } else {
      setSearchFilter('')
    }
    setPage(1)
  };

  useEffect(() => {
    if (searchFilter) {
      console.log(searchFilter)
      fetchProducts(debouncedPage, searchFilter)
    } else {
      fetchProducts(debouncedPage)
    }
  }, [debouncedPage, searchFilter])



  return (
    <div>
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
                disabled={selectedFilterMethod !== input.name ? true : false}
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
            disabled={!(page - 1)}
            className='h-8 w-8 flex justify-center items-center hover:bg-card-hover disabled:text-foreground-lighter disabled:bg-card-alternative disabled:cursor-not-allowed'
          >
            <MdNavigateBefore className='h-6 w-6' />
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
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
        <p className='mt-2 text-foreground-lighter italic text-end'>страница: {debouncedPage}</p>
      </div>
    </div>
  )
}
