import React, { useEffect, useState } from 'react'
import paymentSvg from 'assets/images/payment.svg'
import { useSelector } from 'react-redux'
import { formatMoney } from 'utils/helper'
import { Congration, InputForm, Paypal } from 'components'
import withBaseComponent from 'components/hocs/withBaseComponent'
import { getCurrent } from 'store/user/asyncActions'
const Checkout = ({ dispatch, navigate }) => {
    const [isSuccess, setIsSuccess] = useState(false)
    const { currentCart, current } = useSelector(state => state.user)



    useEffect(() => {
    }, [current.address])

    useEffect(() => {
        if (isSuccess) {
            dispatch(getCurrent())
        }
    }, [isSuccess])
    return (
        <div className='p-8 w-full grid grid-cols-10 gap-6 h-full max-h-screen overflow-y-auto'>
            {isSuccess && <Congration />}
            <div className='w-full flex justify-center items-center col-span-4'>
                <img src={paymentSvg} alt='payment' className='h-[70%] object-contain' />
            </div>
            <div className='flex w-full flex-col justify-center col-span-6'>
                <h2 className='text-3xl font-bold mb-6'>Checkout your order</h2>
                <div className='flex w-full gap-6'>
                    <div className='flex-1'>
                        <table className='table-auto h-fit'>
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
                    </div>
                    <div className='flex-1 flex flex-col justify-between gap-[45px]'>
                        <div>
                            <span className='flex items-center gap-8 text-sm font-bold '>
                                <span className='font-mediu'>Subtotal: </span>
                                <span className='text-main'>{`${formatMoney(currentCart?.reduce((sum, el) => +el.price * el.quantity + sum, 0))}`}</span>
                            </span>
                            <span className='flex items-center gap-8 text-sm font-bold '>
                                <span className='font-mediu'>Address: </span>
                                <span className='text-main'>{current?.address}</span>
                            </span>
                        </div>
                        <div className='w-full'>
                            <Paypal
                                payload={{
                                    products: currentCart,
                                    total: Math.round(+currentCart?.reduce((sum, el) => +el.price * el.quantity + sum, 0) / 23500),
                                    address: current.address
                                }}
                                setIsSuccess={setIsSuccess}
                                amount={Math.round(+currentCart?.reduce((sum, el) => +el.price * el.quantity + sum, 0) / 23500)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withBaseComponent(Checkout)