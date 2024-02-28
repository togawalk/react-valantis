import { md5 } from 'js-md5'
import { getTimestamp } from '.'
import axios from 'axios'

export class FetchData {
  private apiUrl = `${import.meta.env.VITE_API_URL}`
  private headers = {
    'X-Auth': md5(`${import.meta.env.VITE_AUTH_PASS}_${getTimestamp()}`),
  }

  constructor() {}

  async getProducts() {
    const { data } = await axios.post(
      this.apiUrl,

      {
        action: 'get_ids',
        params: { offset: 0, limit: 50 },
      },
      { headers: this.headers }
    )
    return data.result
  }
}

export const fetchData = new FetchData()
