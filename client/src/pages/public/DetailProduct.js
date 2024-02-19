import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiGetProduct, apiGetProducts } from '../../apis'
import { BreadCrumb, Button, CustomSlider, ProductExtraInfoItem, ProductInfomation, SelectQuantity } from '../../components'
import Slider from 'react-slick';
import ReactImageMagnify from 'react-image-magnify';
import { formatMoney, fotmatPrice, renderStartFromNumber } from '../../utils/helper';
import {productExtraIfomation} from '../../utils/contants'

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
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState(null)
  const [update, setUpdate] = useState(false)

  const fetchProductData = async() => {
    const response = await apiGetProduct(pid)
    if(response.success) {
      setProduct(response.productData)
      setCurrentImage(response.productData?.thumb)
    }
  }

  const fetchProducts = async() => {
    const response = await apiGetProducts({category})
    if(response.success) setRelatedProducts(response.products)
  }
  useEffect(() => {
    if(pid) {
      fetchProductData()
      fetchProducts()
    }
    window.scrollTo(0,0)
  }, [pid])

  useEffect(() => {
    if(pid) fetchProductData()
  }, [update])

  const rerender = useCallback(() => {
    setUpdate(!update)
  }, [update])
const handleQuantity = useCallback((number) => {
  let previuous
  if(!Number(number) || Number(number) < 1){
    return
  } else setQuantity(number)

}, [quantity])

const handleChangeQuantity = useCallback((flag) => {
  if(flag === 'minus' && quantity === 1) return
  if(flag === 'minus') setQuantity(prev => +prev - 1 )
  if(flag === 'plus') setQuantity(prev => +prev + 1 )

}, [quantity])

  //xử lý khi click ảnh 
  const handleClickImage = (e, el) => {
    e.stopPropagation()
    setCurrentImage(el)
  }
  return (
    <div className='w-full relative'>
      <div className='h-[81px] flex justify-center items-center bg-gray-100'>
        <div className='w-main'>
          <h3 className='font-semibold'>{title}</h3>
          <BreadCrumb title={title} category={category} pid={pid}/>
        </div>
      </div>
      <div className='w-main m-auto mt-4 flex'>
        <div className='w-2/5 gap-4 flex flex-col'>
          <div className='w-[458px] h-[458px] border overflow-hidden'>
            <ReactImageMagnify {...{
              smallImage: {
                  alt: 'Wristwatch by Ted Baker London',
                  isFluidWidth: true,
                  src: currentImage
              },
              largeImage: {
                  src: currentImage,
                  width: 1800,
                  height: 1500
              }
          }} />
          </div>
          <div className='w-[458px]'>
            <Slider className='image-slider' {...settings}>
              {product?.images?.map(el => (
                <div 
                  key={el} className='flex w-full'>
                  <img 
                    onClick={e => handleClickImage(e, el)}

                    src={el} alt='sub-product' 
                    className='h-[143px] object-cover border cursor-pointer'/>
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className='w-2/5 flex flex-col gap-4 mr-[20px]'>
          <div className='flex items-center justify-between'>
            <h2 className='text-[30px] font-semibold'>{`${formatMoney(fotmatPrice(product?.price))} VND`}</h2>
            <span className='text-sm text-main'>{`In stock: ${product?.quantity}`}</span>
          </div>
          <div className='flex items-center'>
            {renderStartFromNumber(product?.totalRatings)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
            <span  className='text-sm text-main italic'>{`(Sold: ${product?.sold}) pieces`}</span>
          </div>
          <ul className='text-sm text-gray-500 pl-6'>
            {product?.description?.map(el => (
              <li className='leading-6 list-square' key={el}>{el}</li>
            ))}
          </ul>
          <div className='flex flex-col gap-8'>
            <div className='flex items-center gap-4 font-semibold'>
              <span>Quantity</span>
              <SelectQuantity handleQuantity={handleQuantity} quantity={quantity} handleChangeQuantity={handleChangeQuantity}/>
            </div>
            <Button fw>
              Add to cart 
            </Button>
          </div>
        </div>
        <div className='w-1/5'>
          {productExtraIfomation.map(el => (
            <ProductExtraInfoItem
              key={el.id}  
              icon={el.icon}
              title={el.title}
              sub={el.sub}
            />
          ))}
        </div>
      </div>
      <div className='w-main m-auto mt-8'>
        <ProductInfomation 
          totalRatings={product?.totalRatings}
          ratings={product?.ratings}
          nameProduct={product?.title}
          pid={pid}
          rerender={rerender}
        />
      </div>
      <div className='w-main m-auto mt-8'>
        <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>OTHER CUSTOMER ALSO LIKED</h3>
        <CustomSlider products={relatedProducts} normal={true}/>
      </div>
      <div className='h-[100px] w-full'></div>
    </div>
  )
}

export default DetailProduct