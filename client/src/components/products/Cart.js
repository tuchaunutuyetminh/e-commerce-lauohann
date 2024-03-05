import { apiRemoveCart } from 'apis'
import Button from 'components/buttons/Button'
import withBaseComponent from 'components/hocs/withBaseComponent'
import React, { memo } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
import { MdDeleteForever } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { showCart } from 'store/app/appSlice'
import { getCurrent } from 'store/user/asyncActions'
import { formatMoney, fotmatPrice } from 'utils/helper'

const Cart = ({ dispatch }) => {
  const { current } = useSelector(state => state.user)
  const removeCart = async(pid) => { 
    const response = await apiRemoveCart(pid)
      if(response.success) dispatch(getCurrent())
      else toast.error(response.mes)
   }
  return (
    <div
      onClick={e => e.stopPropagation()}
      className='w-[400px] h-screen bg-black grid grid-rows-10 text-white p-6'>
      <header className='row-span-1 h-full border-b border-b-gray-500 flex justify-between items-center font-bold text-2xl'>
        <span>Your cart</span>
        <span
          title='Close cart'
          onClick={() => dispatch(showCart())}
          className='p-2 cursor-pointer'>
          <IoIosCloseCircle size={24} />
        </span>
      </header>
      <section className='row-span-7 h-full overflow-y-auto py-3 flex flex-col gap-3'>
        {!current?.cart && <span className='text-xs italic'>Your cart is empty.</span>}
        {current?.cart && current?.cart?.map(el => (
          <div key={el.product?._id} className='flex justify-between items-center'>
            <div className='flex gap-2'>
              <img src={el?.product?.thumb} alt='thumb' className='w-16 h-16 object-cover' />
              <div className='flex flex-col gap-1'>
                <span className='font-bold'>{el.product.title}</span>
                <span className='text-[10px]'>{el.color}</span>
                <span className='text-sm text-main'>{formatMoney(fotmatPrice(el.product?.price))} VND</span>
              </div>
            </div>
            <span 
              onClick={() => removeCart(el.product._id)}
              className='h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-700 cursor-pointer'>
              <MdDeleteForever size={20} />
            </span>
          </div>
        ))}
      </section>
      <div className='row-span-2 flex flex-col justify-betweens max-h-full'>
        <div className='flex items-center my-4 justify-between pt-4 border-t'>
          <span>Subtotal: </span>
          <span className='text-main font-bold text-[18px]'>{formatMoney(fotmatPrice(current.cart?.reduce((sum, el) => sum + Number((el?.product?.price * el?.quantity)), 0)))} VND</span>
        </div>
        <span className='text-center italic text-xs text-white'>Shipping, taxes, and discounts calculated at checkout.</span>
        <Button fw>Shopping cart</Button>
      </div>
    </div>
  )
}

export default withBaseComponent(memo(Cart))