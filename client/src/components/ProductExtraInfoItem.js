import React, { memo } from 'react'

const ProductExtrainfoItem = ({icon, title, sub}) => {
  return (
    <div className='flex items-center p-3 gap-4 mb-[10px] border'>
        <span className='p-2 text-white bg-gray-800 rounded-full flex items-center'>{icon}</span>
        <div className='flex flex-col text-sm text-gray-500'>
            <span className='font-semibold'>{title}</span>
            <span className='text-xs\'>{sub}</span>
        </div>
    </div>
  )
}

export default memo(ProductExtrainfoItem)