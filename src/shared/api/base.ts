import { md5 } from 'js-md5'
import { getTimestamp, removeProductDuplicates } from '@/shared/lib'
import axios from 'axios'

interface ProductFilter {
  product: string;
}

interface BrandFilter {
  brand: string;
}

interface PriceFilter {
  price: number;
}

export type Filter = ProductFilter | BrandFilter | PriceFilter;

export class FetchData {
  private apiUrl = `${import.meta.env.VITE_API_URL}`
  private headers = {
    'X-Auth': md5(`${import.meta.env.VITE_AUTH_PASS}_${getTimestamp()}`),
  }

  constructor() { }

  async getIds(skip: number) {
    const { data } = await axios.post(
      this.apiUrl,

      {
        action: 'get_ids',
        params: { offset: skip, limit: 5 },
      },
      { headers: this.headers }
    )
    return data.result
  }


  async getProducts(ids: string[]) {

    const { data: products } = await axios.post(
      `${import.meta.env.VITE_API_URL}`,
      {
        action: 'get_items',
        params: { ids: ids },
      },
      {
        headers: this.headers,
      }
    )
    return removeProductDuplicates(products.result)
  }


  // async getIdsWithFilter({ filterBy, value }: getIdsWithFilterProps) {
  async getIdsWithFilter(filters: Filter) {
    const { data } = await axios.post(
      this.apiUrl,
      {
        action: "filter",
        params: filters 
      },
      { headers: this.headers }
    )
    return data.result

  }
}

export const fetchData = new FetchData()
