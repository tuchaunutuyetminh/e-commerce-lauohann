import React, { useCallback, useEffect,useState } from 'react'
import { InputForm, Pagination } from 'components'
import { set, useForm } from 'react-hook-form'
import { apiDeleteProduct, apiGetProducts } from 'apis/product'
import { UpdateProduct } from 'pages/admin'
import moment from 'moment'
import { useSearchParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import useDebounse from 'hook/useDebounse'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

const ManageProduct = () => {
  const {register, formState: {errors}, watch} = useForm()
  const navigate = useNavigate()
  const location = useLocation()

  //biến edit product 
  const [editProduct, setEditProduct] = useState(null)
  //rerender
  const [update, setUpdate] = useState(false)
  // hàm search product 
  const render = useCallback(() => { 
    setUpdate(!update)
   }, [update])
  
  //Lấy params trên search bar 
  const [params] = useSearchParams()
  // hàm lấy products 
  const [products, setProducts] = useState(null)
  const [counts, setCounts] = useState(0)
  const fetchProducts = async(params) => {
    const response = await apiGetProducts({...params, limit: process.env.REACT_APP_LIMIT})
    if(response.success) {
      setProducts(response.products)
      setCounts(response.counts)
    }
  }

  const queryDebounce = useDebounse(watch('q'), 800)
  useEffect(() => {
    if(queryDebounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({
          q: queryDebounce
        }).toString()
      })
    } else navigate({
      pathname: location.pathname
    })
  }, [queryDebounce])
  useEffect(() => { 
    const searchParams = Object.fromEntries([...params])
    
    fetchProducts(searchParams)
   },[params, update])

   const handleDeleteProduct = (pid) => {
    Swal.fire({
      title: 'Delete product.',
      text: 'Are you sure you want to delete this product?',
      icon:'warning',
      showCancelButton: true
    }).then(async(rs) => { 
      if(rs.isConfirmed) {
        const response = await apiDeleteProduct(pid)
        if(response.success) toast.success(response.mes)
        else toast.error(response.mes)
        render()
      }
     })
   }

  //  useEffect(() => { 
  //   fetchProducts()
  //   },[])
  return (
    <div className='w-full flex flex-col gap-4 relative'>
      { editProduct && <div className='absolute inset-0 z-50 bg-gray-100 min-h-screen'>
        <UpdateProduct 
          editProduct={editProduct} 
          render={render}
          setEditProduct={setEditProduct}
        />
      </div>}
      <div className='h-[69px] w-full]'></div>
      <h1 className='h-[75px] w-full flex justify-between items-center text-3xl font-bold px-4 border-b uppercase fixed top-0 bg-gray-100'>
        <span>Manage Products</span>
      </h1>

      {/* search sản phẩm */}
      <div className='flex w-full justify-end items-center px-4'>
        <form className='w-[45%]'>
          <InputForm
            id='q'
            register={register}
            errors={errors}
            fullWidth
            placeholder='Search products by title, description,..'
          />
        </form>
      </div>
      <table className='table-auto'>
        <thead>
          <tr className='bg-sky-900 text-white border-white'>
            <th className='text-center py-2'>Order</th>
            <th className='text-center py-2'>Thumb</th>
            <th className='text-center py-2'>title</th>
            <th className='text-center py-2'>Brand</th>
            <th className='text-center py-2'>Category</th>
            <th className='text-center py-2'>Price</th>
            <th className='text-center py-2'>Quantity</th>
            <th className='text-center py-2'>Sold</th>
            <th className='text-center py-2'>Color</th>
            <th className='text-center py-2'>Ratings</th>
            <th className='text-center py-2'>UpdatedAt</th>
            <th className='text-center py-2'>Actions</th>

          </tr>
        </thead>
        <tbody>
          {products?.map((el, idx) => (
            <tr key={el._id} className='border-b'>
              <td className='text-center p-2'>{((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_LIMIT) + (idx + 1)}</td>
              <td className='text-center p-2'>
                <img src={el.thumb} alt='thumb' className='w-12 h-12 object-cover'/>
              </td>
              <td className='text-center p-2'>{el.title}</td>
              <td className='text-center p-2'>{el.brand}</td>
              <td className='text-center p-2'>{el.category}</td>
              <td className='text-center p-2'>{el.price}</td>
              <td className='text-center p-2'>{el.quantity}</td>
              <td className='text-center p-2'>{el.sold}</td>
              <td className='text-center p-2'>{el.color}</td>
              <td className='text-center p-2'>{el.totalRatings}</td>
              <td className='text-center p-2'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
              <td className='text-center p-2'>
                <span 
                  onClick={() => setEditProduct(el)}
                  className='text-blue-500 hover:underline cursor-pointer px-1'
                >
                  Edit
                </span>
                <span 
                  onClick={() => handleDeleteProduct(el._id)}
                  className='text-blue-500 hover:underline cursor-pointer px-1'>
                  Remove
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='w-full flex justify-end my-8'>
        <Pagination
          totalCount={counts}
        />
      </div>
    </div>
  )
}

export default ManageProduct