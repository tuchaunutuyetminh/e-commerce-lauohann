import { Button, Product } from 'components'
import React from 'react'
import { useSelector } from 'react-redux'

const Wishlist = () => {
  const { current } = useSelector(state => state.user)
  return (
    <div className='w-full relative p-4'>
      <header className='text-3xl font-semibold uppercase py-4 border-b border-b-blue-200'>
        My Wishlist
      </header>

      <div className='p-4 w-full flex flex-wrap gap-4'>
        {current?.wishlist?.map(el => (
          <div key={el._id} className='bg-white rounded-md drop-shadow w-[300px] gap-3 pt-3'>
            <Product
              pid={el._id}
              productData={el}
              isShowOption
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist