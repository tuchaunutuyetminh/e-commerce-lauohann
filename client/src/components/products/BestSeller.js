import React, { useEffect, useState } from 'react'
import { apiGetProducts } from '../../apis/product'
import CustomSlider from '../common/CustomSlider';
import {getNewProducts} from '../../store/products/asyncAction'
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx'
const tabs = [
    {id: 1, name: 'best sellers'},
    {id: 2, name: 'new arrivals'},
    // {id: 3, name: 'tablet'}
]

const BestSeller = () => {
  const [bestSellers, setBestSellers] = useState(null)
  const [activedTab, setActivedTab] = useState(1)
  const [products, setProducts] = useState(null)
  
  const {newProduct} = useSelector(state => state.products)
  const {isShowModal} = useSelector(state => state.app)

  const dispatch = useDispatch()
  const fetchProducts = async () => {
    const response = await apiGetProducts({ sort: '-sold'})
    if(response?.success) {
      setBestSellers(response.products)
      setProducts(response.products)
    }
  }

  useEffect(() => {
    fetchProducts()
    dispatch(getNewProducts())
  }, [])
  useEffect(() => {
    if(activedTab === 1) setProducts(bestSellers)
    if(activedTab === 2) setProducts(newProduct)
  }, [activedTab])
  return (
    <div className={clsx(isShowModal ? 'hidden' : '')}>
        <div className='flex text-[20px] ml-[-32px]'>
            {tabs.map(el => (
                <span 
                    key={el.id} 
                    className={`font-semibold cursor-pointer capitalize px-8 border-r text-gray-400 ${activedTab === el.id ? 'text-gray-900' : ' '}`}
                    onClick={() => {
                        setActivedTab(el.id)
                    }}
                    >{el.name}</span>
            ))}

        </div>
        <div className='mt-4 mx-[-10px] border-t-2 pt-4 border-t-main'>
          <CustomSlider products={products} activedTab={activedTab}/>
        </div>
        <div className='w-full flex gap-4 mt-8'>
          <img src='https://digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657' alt=''
            className='flex-1 object-contain'
          />
          <img 
            src='https://digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657' 
            alt=''
            className='flex-1 object-contain'
            />
        </div>
    </div>
  )
}

export default BestSeller