import React, { memo, useState } from 'react'
import {productInfoTabs} from '../utils/contants'
import {Votebar} from '../components'
import { renderStartFromNumber } from '../utils/helper'
const ProductInfomation = ({totalRatings,totalCount}) => {
    const [activedTab, setActivedTab] = useState(1)
  return (
    <div>
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
            {activedTab === 5 && <div className='flex p-4'>
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
            </div>}
        </div>
    </div>
  )
}

export default memo(ProductInfomation)