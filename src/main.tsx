import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'

const queryClient = new QueryClient()
const notify = (error: Error | AxiosError) => {
  toast(error.message);
}

axios.interceptors.response.use(function(response) {
  return response;
}, function(error) {
  notify(error)
  return Promise.reject(error);
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
],
  {
    basename: '/react-valantis'
  }
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)
