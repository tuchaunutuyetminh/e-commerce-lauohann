import React from 'react'
import paymentSvg from 'assets/images/payment.svg'
import { useSelector } from 'react-redux'
import { formatMoney } from 'utils/helper'
import { Paypal } from 'components'
const Checkout = () => {
    const { currentCart} = useSelector(state => state.user)
    console.log(currentCart)
    return (
        <div className='p-8 w-full grid grid-cols-10 gap-6 h-full max-h-screen overflow-y-auto'>
            <div className='w-full flex justify-center items-center col-span-4'>
                <img src={paymentSvg} alt='payment' className='h-[70%] object-contain' />

            </div>
            <div className='flex w-full flex-col justify-center col-span-6 items-center'>
                <h2 className='text-3xl font-bold mb-6'>Checkout your order</h2>
                <table className='table-auto w-full'>
                    <thead>
                        <tr className='border bg-gray-200'>
                            <th className='p-2 text-left'>Products</th>
                            <th className='p-2 text-center'>Quantity</th>
                            <th className='p-2 text-right'>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCart?.map(el => (
                            <tr key={el._id} className='border'>
                                <td className='text-left p-2'>{el.title}</td>
                                <td className='text-center p-2'>{el.quantity}</td>
                                <td className='text-right p-2 text-main'>{formatMoney(el.price)} VND</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <span className='flex items-center gap-8 text-sm font-bold '>
                    <span>Subtotal: </span>
                    <span className='text-main'>{`${formatMoney(currentCart?.reduce((sum, el) => +el.price*el.quantity + sum, 0))}`}</span>
                </span>
                <div>
                    input address
                </div>
                <div className='w-full mx-auto'>
                    <Paypal amount={120}/>
                </div>
            </div>
        </div>
    )
}

export default Checkout