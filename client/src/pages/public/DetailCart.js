import { BreadCrumb, Button, SelectQuantity } from 'components'
import withBaseComponent from 'components/hocs/withBaseComponent'
import React, { memo, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { formatMoney, fotmatPrice } from 'utils/helper'

const DetailCart = ({ location }) => {
    const { current } = useSelector(state => state.user)
    const [quantity, setQuantity] = useState(1)
    const handleQuantity = (number) => {
        if (+number > 1) setQuantity(number)
    }

    const handleChangeQuantity = useCallback((flag) => {
        if (flag === 'minus' && quantity === 1) return
        if (flag === 'minus') setQuantity(prev => +prev - 1)
        if (flag === 'plus') setQuantity(prev => +prev + 1)

    }, [quantity])
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
                {current?.cart?.map(el => (
                    <div key={el._id} className='w-main mx-auto border-b my-8 font-bold grid grid-cols-10'>
                        <span className='col-span-6 w-full text-center'>
                            <div className='flex gap-2'>
                                <img src={el?.product?.thumb} alt='thumb' className='w-28 h-28 object-cover' />
                                <div className='flex flex-col items-startgap-1'>
                                    <span className='font-bold'>{el.product.title}</span>
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
                            <span className='text-lg text-main'>{formatMoney(el.product?.price * el.quantity)} VND</span>
                        </span>
                    </div>
                ))}
            </div>
            <div className='w-main mx-auto flex flex-col justify-center items-end gap-3'>
                    <span className='flex items-center gap-8 text-sm'>
                        <span>Subtotal: </span>
                        <span className='text-main'>{`${formatMoney(current?.cart?.reduce((sum, el) => el.product?.price + sum, 0))}`}</span>
                    </span>
                    <span className='text-xs italic'>Shipping, taxes, and discounts calculated at checkout.</span>
                    <Button>Checkout</Button>
            </div>
        </div>
    )
}

export default withBaseComponent(memo(DetailCart))