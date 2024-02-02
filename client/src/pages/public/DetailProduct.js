import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiGetProduct } from '../../apis'
import { BreadCrumb } from '../../components'

const DetailProduct = () => {

  const [product, setProduct] = useState(null)
  const {pid, title, category} = useParams()
  const fetchProductData = async() => {
    const response = await apiGetProduct(pid)
    console.log(response)
    if(response.success) setProduct(response.productData)
  }
  useEffect(() => {
    if(pid) fetchProductData()
  }, [pid])
  return (
    <div className='w-full'>
      <div className='h-[81px] flex justify-center items-center bg-gray-100'>
        <div className='w-main'>
          <h3>{title}</h3>
          <BreadCrumb title={title} category={category} pid={pid}/>
        </div>
      </div>
    </div>
  )
}

export default DetailProduct