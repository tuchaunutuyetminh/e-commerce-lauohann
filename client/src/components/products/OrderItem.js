import SelectQuantity from 'components/common/SelectQuantity'
import withBaseComponent from 'components/hocs/withBaseComponent'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { updateCart } from 'store/user/userSlice'
import { formatMoney } from 'utils/helper'

const OrderItem = ({ el, defaultQuantity = 1, dispatch }) => {
    const [quantity, setQuantity] = useState(() => defaultQuantity)

    const handleQuantity = (number) => {
        if (+number > 1) setQuantity(number)
    }
    const handleChangeQuantity = useCallback((flag) => {
        if (flag === 'minus' && quantity === 1) return
        if (flag === 'minus') setQuantity(prev => +prev - 1)
        if (flag === 'plus') setQuantity(prev => +prev + 1)

    }, [quantity])
    //set quantity
    useEffect(() => { 
        dispatch(updateCart({ pid: el.product?._id, quantity, color: el.color }))
     }, [quantity])
    return (
        <div className='w-main mx-auto border-b my-8 font-bold grid grid-cols-10'>
            <span className='col-span-6 w-full text-center'>
                <div className='flex gap-2 px-4 py-2'>
                    <img src={el.thumbnail} alt='thumb' className='w-28 h-28 object-cover' />
                    <div className='flex flex-col items-startgap-1'>
                        <span className='font-bold'>{el.title}</span>
                        <span className='text-[10px] font-main'>{el.color}</span>
                    </div>
                </div>
            </span>
            <span className='col-span-1 w-full text-center'>
                <div className='flex items-center h-full'>
                    <SelectQuantity
                        handleQuantity={handleQuantity}
                        quantity={quantity}
                        handleChangeQuantity={handleChangeQuantity} />
                </div>
            </span>
            <span className='col-span-3 w-full text-center justify-center items-center flex h-full'>
                <span className='text-lg text-main'>{formatMoney(el.price * quantity)} VND</span>
            </span>
        </div>
    )
}

export default withBaseComponent(memo(OrderItem))