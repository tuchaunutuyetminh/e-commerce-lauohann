import React, { memo, useState, useCallback } from 'react'
import {productInfoTabs} from '../utils/contants'
import {Button, VoteOption, Votebar} from '../components'
import { renderStartFromNumber } from '../utils/helper'
import {apiRatings} from '../apis'
import { useDispatch } from 'react-redux'
import {showModal} from '../store/app/appSlice'

const ProductInfomation = ({totalRatings,totalCount, nameProduct}) => {
    const [activedTab, setActivedTab] = useState(1)
    const [isVote, setIsVote] = useState(false)

    const dispatch = useDispatch()
    const toggleVote = () => {

    }
  return (
    <div className=''>
        
        <div className='flex items-center gap-2 relative bottom-[-1px]'>
            {productInfoTabs.map(el => (
                <span 
                    className={`uppercase py-2 px-4 cursor-pointer ${activedTab === el.id ? 'bg-white border border-b-0' : 'bg-gray-200'}`}
                    key={el.id}
                    onClick={() => setActivedTab(el.id)}
                >{el.name}</span>
            ))}
                <div 
                    className={`uppercase py-2 px-4 cursor-pointer ${activedTab === 5 ? 'bg-white border border-b-0' : 'bg-gray-200'}`}
                    onClick={() => setActivedTab(5)}
                >Customer review</div>
        </div>
        <div className='w-full border'>
            {productInfoTabs.some(el => el.id === activedTab) && productInfoTabs.find(el => el.id === activedTab)?.content}
            {activedTab === 5 && <div className='flex flex-col p-4'>
                <div className='flex'>
                    <div className='flex-4 border border-red-500 flex flex-col items-center justify-center'>
                        <span className='font-semibold text-3xl'>{`${totalRatings}/5`}</span>
                        <span className='flex items-center gap-1'>{renderStartFromNumber(totalRatings)?.map((el, index) => (
                            <span key={index}>{el}</span>
                        ))}</span>
                        <span className='text-sm'>{`${totalCount} reviewers and commentors`}</span>
                    </div>
                    <div className='flex-6 border flex flex-col p-4 gap-2'>
                        {Array.from(Array(5).keys()).reverse().map(el => (
                            <Votebar
                                key={el}
                                number={el+1}
                                ratingCount = {2}
                                ratingTotal = {5}
                            />
                        ))}
                    </div>
                </div>
            <div className='flex items-center flex-col p-4 justify-center text-sm gap-2'>
                <span>Do you review this product?</span>
                <Button handleOnclick={() => dispatch(showModal({isShowModal: true, modalChildren: <VoteOption nameProduct={nameProduct} />}))}>Vote now!</Button>
            </div>
            </div>}
        </div>
    </div>
  )
}

export default memo(ProductInfomation)