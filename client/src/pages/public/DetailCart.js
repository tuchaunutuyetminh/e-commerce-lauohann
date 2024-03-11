import { BreadCrumb, Button, OrderItem } from 'components'
import withBaseComponent from 'components/hocs/withBaseComponent'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { formatMoney } from 'utils/helper'

const DetailCart = ({ location, dispatch }) => {
    const { currentCart } = useSelector(state => state.user)

    return (
        <div className='w-full'>
            <div className='h-[81px] flex justify-center items-center bg-gray-100'>
                <div className='w-main'>
                    <h3 className='font-semibold uppercase'>My cart</h3>
                    <BreadCrumb category={location.pathmane} />
                </div>
            </div>
            <div className='flex flex-col border w-main mx-auto my-8'>
                <div className='py-4 w-main mx-auto bg-gray-200 opacity-70 font-bold grid grid-cols-10'>
                    <span className='col-span-6 w-full text-center'>Products</span>
                    <span className='col-span-1 w-full text-center'>Quantity</span>
                    <span className='col-span-3 w-full text-center'>Price</span>
                </div>
                {currentCart?.map(el => (
                    <OrderItem
                        defaultQuantity={el.quantity}
                        key={el._id} el={el} />
                ))}
            </div>
            <div className='w-main mx-auto flex flex-col justify-center items-end gap-3'>
                <span className='flex items-center gap-8 text-sm'>
                    <span>Subtotal: </span>
                    <span className='text-main'>{`${formatMoney(currentCart?.reduce((sum, el) => +el.price*el.quantity + sum, 0))}`}</span>
                </span>
                <span className='text-xs italic'>Shipping, taxes, and discounts calculated at checkout.</span>
                <Button>Checkout</Button>
            </div>
        </div>
    )
}

export default withBaseComponent(memo(DetailCart))