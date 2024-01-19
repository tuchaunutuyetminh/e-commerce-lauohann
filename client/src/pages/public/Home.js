import React, { useEffect, useState} from 'react'
import {Banner, Navigation, Sidebar, BestSeller} from '../../components'
import { apiGetProducts } from '../../apis/product'

const Home = () => {
  
  return (
    <div className='w-main flex'>
      <div className='flex flex-col gap-5 w-[20%] flex-auto'>
        <Sidebar />
        <span>Deal daily</span>
      </div>
      <div className='flex flex-col gap-5 pl-5 w-[80%] flex-auto'>
        <Banner />
        <BestSeller />
      </div>
    </div>
  )
}

export default Home