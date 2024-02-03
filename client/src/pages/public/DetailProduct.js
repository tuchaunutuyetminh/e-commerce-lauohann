import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiGetProduct } from '../../apis'
import { BreadCrumb } from '../../components'
import Slider from 'react-slick';
import ReactImageMagnify from 'react-image-magnify';
var settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1
};

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
      <div className='w-main m-auto mt-4 flex'>
        <div className='w-2/5 gap-4 flex flex-col'>
          <div className='w-[458px] h-[458px] border'>
            <ReactImageMagnify {...{
              smallImage: {
                  alt: 'Wristwatch by Ted Baker London',
                  isFluidWidth: true,
                  src: product?.thumb
              },
              largeImage: {
                  src: product?.thumb,
                  width: 1800,
                  height: 1500
              }
          }} />
          </div>
          <div className='w-[458px]'>
            <Slider className='image-slider' {...settings}>
              {product?.images?.map(el => (
                <div key={el} className='flex w-full gap-2'>
                  <img src={el} alt='sub-product' className='w-[143px] h-[143px] object-cover border'/>
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className='w-2/5'>
          price
        </div>
        <div className='w-1/5'>
          infomation
        </div>
      </div>
      <div className='h-[500px]'></div>
    </div>
  )
}

export default DetailProduct