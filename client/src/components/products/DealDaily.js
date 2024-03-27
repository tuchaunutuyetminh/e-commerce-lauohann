import React, { memo, useEffect, useState } from 'react'
import icons from '../../utils/icons'
import moment from 'moment'
import { apiGetProducts } from '../../apis/product'
import { formatMoney, renderStartFromNumber, secondsToHms } from '../../utils/helper'
import { IoMdMenu } from 'react-icons/io'
import CountDown from '../common/CountDown'
import { useSelector } from 'react-redux'
import withBaseComponent from 'components/hocs/withBaseComponent'
import { getDealDaily } from 'store/products/productSlice'
const { AiFillStar } = icons
const DealDaily = ({dispatch}) => {
    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)
    const [second, setSecond] = useState(0)
    const [expireTime, setExpireTime] = useState(false)

    const {dealDaily} = useSelector(state => state.products)
    let idInterval
    const fecthDealDaily = async () => {
        const response = await apiGetProducts({sort: '-totalRatings', limit: 20})
        if(response.success) {
            const pr = response.products[Math.round(Math.random()*20)]
            dispatch(getDealDaily({data: pr, time: Date.now() + 24*60*60*1000}))
            
        //     const today = `${moment().format('MM/DD/YYYY')} 7:00:00`

        //     const seconds = new Date(today).getTime() - new Date().getTime() + 24 * 3600 * 1000
        //     const number = secondsToHms(seconds)
        //     setHour(number.h)
        //     setMinute(number.m)
        //     setSecond(number.s)
        // } else {
        //     setHour(0)
        //     setMinute(59)
        //     setSecond(59)
        }
    }
    // useEffect(() => {
    //     fecthDealDaily()
    // }, [])
    useEffect(() => { 
        if(dealDaily?.time) {
            const deltaTime = dealDaily.time - Date.now()
            const miliscond = deltaTime / 3600000
            const number = secondsToHms(deltaTime)
            setHour(number.h)
            setMinute(number.m)
            setSecond(number.s)
        }
     }, [dealDaily])
    useEffect(() => {
        idInterval && clearInterval(idInterval)
        if(moment(moment(dealDaily?.time).format('MM/DD/YYYY')).isBefore(moment())) fecthDealDaily()
    }, [expireTime])

    useEffect(() => {
        idInterval = setInterval(() => {
            if(second>0) setSecond(prev => prev-1)
            else{
                if(minute>0) {
                    setMinute(prev => prev - 1)   
                    setSecond(59)
                } else {
                    if(hour>0) {
                        setHour(prev => prev - 1)
                        setMinute(59)
                        setSecond(59)
                    } else {
                        setExpireTime(!expireTime)
                    }
                }
            }
        }, 1000)
        return () => {
            clearInterval(idInterval)
        }
    }, [second, minute, hour, expireTime])

   
  return (
    <div className='border w-full flex-auto'>
        <div className='flex items-center justify-between p-4'>
            <span className='flex-1 flex justify-center'><AiFillStar size={20} color='#DD1111'/></span>
            <span className='flex-8 font-semibold text-[20px] flex justify-center text-gray-700'>DEAL DAILY</span>
            <span className='flex-1'></span>
        </div>
        <div className='w-full flex flex-col items-center pt-8 px-4 gap-2'>
            <img src={dealDaily?.data?.thumb || 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'} 
            alt='product image' 
            className='w-full object-contain'
            />
            <span className='line-clamp-1 text-center'>{dealDaily?.data?.title}</span>
            <span className='flex h-4'>{renderStartFromNumber(dealDaily?.data?.totalRatings, 20)?.map((e, index) => (
                <span key={index}>{e}</span>
            ))}</span>
            <span>{`${formatMoney(dealDaily?.data?.price)} VND`}</span>
        </div>
        <div className='px-4 mt-8'>
            <div className='flex justify-center items-center gap-2 mb-4'>
                <CountDown unit={'Hours'} number={hour}/>
                <CountDown unit={'Minutes'} number={minute}/>
                <CountDown unit={'seconds'} number={second}/>
            </div>
            <button
                type='button'
                className='flex gap-2 items-center w-full justify-center bg-main hover:bg-gray-800 hover:text-white font-medium py-2'
            >
                <IoMdMenu />
                <span>Options</span>
            </button>
        </div>
    </div>
  )
}

export default withBaseComponent(memo(DealDaily))