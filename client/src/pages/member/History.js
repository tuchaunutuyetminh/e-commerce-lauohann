import { apiGetOrders, apiGetUserOrders } from 'apis'
import { CustomSelect, InputForm, Pagination } from 'components'
import withBaseComponent from 'components/hocs/withBaseComponent'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiCustomize } from 'react-icons/bi'
import { FaRegEdit } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import { statusOrders, statusorders } from 'utils/contants'

const History = ({navigate, location}) => {
  const { register, formState: { errors }, watch, setValue } = useForm()

  const q = watch('q')
  const status = watch('status')
  const [orders, setOrders] = useState(null)
  const [counts, setCounts] = useState(0)
  const [params] = useSearchParams()

  const fetchOrders = async (params) => {
    const response = await apiGetUserOrders({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    })
    if (response.success) {
      setOrders(response.orders)
      setCounts(response.counts)
    }
  }

  const handleSearchStatus = ({value}) => { 
    navigate({
      pathname: location.pathname,
      search: createSearchParams({status: value}).toString()
    })
   }
  useEffect(() => {
    const pr = Object.fromEntries([...params])
    fetchOrders(pr)
  }, [params])
  return (
    <div className='w-full relative p-4'>
      <header className='text-3xl font-semibold uppercase py-4 border-b border-b-blue-200'>
        Buy history
      </header>

      <div className='flex w-full justify-end items-center px-4'>
        <form className='w-[45%] grid grid-cols-2 gap-4'>
          <div className='col-span-1'>
            <InputForm
              id='q'
              register={register}
              errors={errors}
              fullWidth
              placeholder='Search orders by status...'
            />
          </div>

          <div className='col-span-1 flex items-center'>
            <CustomSelect
              options={statusOrders}
              value={status}
              onChange={val => handleSearchStatus(val)}
              wrapClassname='w-full'
            />

          </div>
        </form>
      </div>

      <table className='table-auto w-full'>
        <thead>
          <tr className='bg-sky-900 text-white border-white'>
            <th className='text-center py-2'>#</th>
            <th className='text-center py-2'>Products</th>
            <th className='text-center py-2'>Total</th>
            <th className='text-center py-2'>Status</th>
            <th className='text-center py-2'>Created At</th>
            <th className='text-center py-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((el, idx) => (
            <tr key={el._id} className='border-b'>
              <td className='text-center p-2'>{((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_LIMIT) + (idx + 1)}</td>
              <td className='text-center p-2'>
                <span className='flex flex-col'>
                  {el.products?.map(item => (
                    <span key={item._id}>{`• ${item.title} - ${item.color}`}</span>
                  ))}
                </span>
              </td>
              <td className='text-center p-2'>{el.total}</td>
              <td className='text-center p-2'>{el.status}</td>
              <td className='text-center p-2'>{moment(el.createdAt)?.format('DD/MM/YYYY')}</td>
              <td className='text-center p-2'>
                <span
                  className='text-blue-500 hover:text-orange-500 hover:underline inline-block cursor-pointer px-1'
                >
                  <FaRegEdit />
                </span>
                <span
                  className='text-blue-500 hover:text-orange-500 hover:underline inline-block cursor-pointer px-1'>
                  <RiDeleteBin6Line />
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

export default withBaseComponent(History)