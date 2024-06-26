import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createSearchParams, useParams } from 'react-router-dom'
import { apiGetProduct, apiGetProducts, apiUpdateCart } from '../../apis'
import { BreadCrumb, Button, CustomSlider, ProductExtraInfoItem, ProductInfomation, SelectQuantity } from '../../components'
import Slider from 'react-slick';
import ReactImageMagnify from 'react-image-magnify';
import { formatMoney, fotmatPrice, renderStartFromNumber } from '../../utils/helper';
import { productExtraIfomation } from '../../utils/contants'
import DOMPurify from 'dompurify';
import clsx from 'clsx'
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import withBaseComponent from 'components/hocs/withBaseComponent';
import path from 'utils/path';
import { toast } from 'react-toastify';
import { getCurrent } from 'store/user/asyncActions';
var settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1
};


const DetailProduct = ({ location, isQuickView, data, navigate, dispatch }) => {

  const titleRef = useRef()
  const [product, setProduct] = useState(null)
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState(null)
  const [update, setUpdate] = useState(false)
  const [varriant, setVarriant] = useState(null)
  const [pid, setPid] = useState(null)
  const [category, setcategory] = useState(null)
  const { current } = useSelector(state => state.user)
  const [currentProduct, setcurrentProduct] = useState({
    title: '',
    thumb: '',
    price: '',
    images: [],
    color: ''
  })

  useEffect(() => {
    if (data) {
      setPid(data.pid)
      setcategory(data.category)
    }
    else if (params) {
      setPid(params.pid)
      setcategory(params.category)
    }
  }, [data, params])
  useEffect(() => {
    if (varriant) {
      setcurrentProduct({
        title: product?.varriants?.find(el => el.sku === varriant)?.title,
        color: product?.varriants?.find(el => el.sku === varriant)?.color,
        price: product?.varriants?.find(el => el.sku === varriant)?.price,
        images: product?.varriants?.find(el => el.sku === varriant)?.images,
        thumb: product?.varriants?.find(el => el.sku === varriant)?.thumb,
      })
    } else {
      setcurrentProduct({
        title: product?.title,
        color: product?.color,
        images: product?.images || [],
        price: product?.price,
        thumb: product?.thumb
      })
    }
  }, [varriant, product])
  const fetchProductData = async () => {
    const response = await apiGetProduct(pid)
    if (response.success) {
      setProduct(response.productData)
      setCurrentImage(response.productData?.thumb)
    }
  }

  const fetchProducts = async () => {
    const response = await apiGetProducts({ category })
    if (response.success) setRelatedProducts(response.products)
  }
  useEffect(() => {
    if (pid) {
      fetchProductData()
      fetchProducts()
    }
    window.scrollTo(0, 0)
    titleRef.current.scrollIntoView({ block: 'start' })
  }, [pid])

  useEffect(() => {
    if (pid) fetchProductData()
  }, [update])

  const rerender = useCallback(() => {
    setUpdate(!update)
  }, [update])
  const handleQuantity = useCallback((number) => {
    if (!Number(number) || Number(number) < 1) {
      return
    } else setQuantity(number)

  }, [quantity])

  const handleChangeQuantity = useCallback((flag) => {
    if (flag === 'minus' && quantity === 1) return
    if (flag === 'minus') setQuantity(prev => +prev - 1)
    if (flag === 'plus') setQuantity(prev => +prev + 1)

  }, [quantity])

  //xử lý khi click ảnh 
  const handleClickImage = (e, el) => {
    e.stopPropagation()
    setCurrentImage(el)
  }

  const handleAddToCart = async () => {
    if (!current) return Swal.fire({
      title: 'Almost...',
      text: 'Please login first!!',
      icon: 'info',
      cancelButtonText: 'Not now!',
      showCancelButton: true,
      confirmButtonText: 'Go login',

    }).then((rs) => {
      if (rs.isConfirmed) navigate({
        pathname: `/${path.LOGIN}`,
        search: createSearchParams({ redirect: location.pathname }).toString()
      })
    })
    const response = await apiUpdateCart({
      pid: pid,
      color: currentProduct?.color || product?.color,
      quantity,
      price: currentProduct?.price || product?.price,
      thumbnail: currentProduct?.thumb || product?.thumb,
      title: currentProduct?.title || product?.title,

    })
    if (response.success) {
      toast.success(response.mes)
      dispatch(getCurrent())
    }
    else toast.error(response.mes)
  }
  return (
    <div className={clsx('w-full')}>
      {!isQuickView && <div className='h-[81px] flex justify-center items-center bg-gray-100'>
        <div ref={titleRef} className='w-main'>
          <h3 className='font-semibold'>{currentProduct?.title || product?.title}</h3>
          <BreadCrumb title={currentProduct?.title || product?.title} category={category} pid={pid} />
        </div>
      </div>}
      <div onClick={e => e.stopPropagation()} className={clsx('bg-white m-auto mt-4 flex', isQuickView ? 'max-w-[900px] gap-16 p-8 max-h-[80vh] overflow-y-auto' : 'w-main')}>
        <div className={clsx('w-2/5 gap-4 flex flex-col', isQuickView && 'w-1/2')}>
          <div className='w-[458px] h-[458px] border flex items-center overflow-hidden'>
            <ReactImageMagnify {...{
              smallImage: {
                alt: 'Wristwatch by Ted Baker London',
                isFluidWidth: true,
                src: currentProduct.thumb || currentImage
              },
              largeImage: {
                src: currentProduct.thumb || currentImage,
                width: 1800,
                height: 1500
              },
              className: 'my-auto'
            }} />
          </div>
          <div className='w-[458px]'>
            <Slider className='image-slider' {...settings}>
              {currentProduct?.images?.length === 0 && product?.images?.map(el => (
                <div
                  key={el} className='flex w-full'>
                  <img
                    onClick={e => handleClickImage(e, el)}

                    src={el} alt='sub-product'
                    className='h-[143px] object-cover border cursor-pointer' />
                </div>
              ))}

              {currentProduct?.images?.length > 0 && currentProduct?.images?.map(el => (
                <div
                  key={el} className='flex w-full'>
                  <img
                    onClick={e => handleClickImage(e, el)}

                    src={el} alt='sub-product'
                    className='h-[143px] object-cover border cursor-pointer' />
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className={clsx('w-2/5 flex flex-col gap-4 mr-[20px]', isQuickView && 'w-1/2')}>
          <div className='flex items-center justify-between'>
            <h2 className='text-[30px] font-semibold'>{`${formatMoney(fotmatPrice(currentProduct?.price || product?.price))} VND`}</h2>
            <span className='text-sm text-main'>{`In stock: ${product?.quantity}`}</span>
          </div>
          <div className='flex items-center'>
            {renderStartFromNumber(product?.totalRatings)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
            <span className='text-sm text-main italic'>{`(Sold: ${product?.sold}) pieces`}</span>
          </div>
          <ul className='text-sm text-gray-500 pl-6'>
            {product?.description?.length > 1 && product?.description?.map(el => (
              <li className='leading-6 list-square' key={el}>{el}</li>
            ))}

            {/* để chắc chắn là nạp vào thẻ dic là html thôi k có đoạn script nào cả thì dùng thư viện domPurify */}
            {product?.description?.length === 1 && <div className='text-sm line-clamp-[10] mb-8' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description[0]) }}></div>}
          </ul>
          {/* varriant */}
          <div className='my-4 flex gap-4'>
            <span className='font-bold'>Color:</span>
            <div className='flex flex-wrap gap-4 items-center w-full'>
              <div
                onClick={() => setVarriant(null)}
                className={clsx('flex items-center gap-2 border p-2 cursor-pointer', !varriant && 'border-red-500 rounded-md')}>
                <img src={product?.thumb} alt='thumb' className='w-8 h-8 rounded-md object-cover' />
                <span className='flex flex-col'>
                  <span>{product?.color}</span>
                  <span className='text-sm'>{formatMoney(product?.price)}</span>
                </span>
              </div>
              {product?.varriants?.map(el => (
                <div
                  onClick={() => setVarriant(el.sku)}
                  className={clsx('flex items-center gap-2 border p-2 cursor-pointer', varriant === el.sku && 'border-red-500 rounded-md')}
                  key={el?.sku}>
                  <img src={el?.thumb} alt='thumb' className='w-8 h-8 rounded-md object-cover' />
                  <span className='flex flex-col'>
                    <span>{el?.color}</span>
                    <span className='text-sm'>{formatMoney(el?.price)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className='flex flex-col gap-8'>
            <div className='flex items-center gap-4 font-semibold'>
              <span>Quantity</span>
              <SelectQuantity handleQuantity={handleQuantity} quantity={quantity} handleChangeQuantity={handleChangeQuantity} />
            </div>
            <Button fw handleOnclick={handleAddToCart}>
              Add to cart
            </Button>
          </div>
        </div>
        {!isQuickView && <div className='w-1/5'>
          {productExtraIfomation.map(el => (
            <ProductExtraInfoItem
              key={el.id}
              icon={el.icon}
              title={el.title}
              sub={el.sub}
            />
          ))}
        </div>}
      </div>
      {!isQuickView && <div className='w-main m-auto mt-8'>
        <ProductInfomation
          totalRatings={product?.totalRatings}
          ratings={product?.ratings}
          nameProduct={product?.title}
          pid={pid}
          rerender={rerender}
        />
      </div>}
      {!isQuickView && <div className='w-main m-auto mt-8'>
        <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>OTHER CUSTOMER ALSO LIKED</h3>
        <CustomSlider products={relatedProducts} normal={true} />
      </div>
      }
      {!isQuickView && <div className='h-[100px] w-full'></div>}
    </div>
  )
}

export default withBaseComponent(DetailProduct)