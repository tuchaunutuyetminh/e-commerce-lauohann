import React, { memo, useState } from 'react'
import { formatMoney, renderStartFromNumber } from '../../utils/helper'
import label from '../../assets/images/new.png'
import trending from '../../assets/images/trending.png'
import SelectOption from '../search/SelectOption'
import icons from '../../utils/icons'
import { Link } from 'react-router-dom'
import path from '../../utils/path'
import withBaseComponent from 'components/hocs/withBaseComponent'
import { showModal } from 'store/app/appSlice'
import { DetailProduct } from 'pages/public'
import { apiUpdateCart } from 'apis'
import { toast } from 'react-toastify'
import { getCurrent } from 'store/user/asyncActions'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'

const { AiFillEye, BsFillHeartFill, FaCartPlus, BsCartCheckFill } = icons

const Product = ({ productData, isNew, normal, navigate, dispatch }) => {
  const [isShowOption, setisShowOption] = useState(false)
  const {current} = useSelector(state => state.user)
  const handleClickOptions = async(e, flag) => {
    e.stopPropagation()
    if (flag === 'CART') {
      if(!current) return Swal.fire({
        title: 'Almost...',
        text: 'Please login first!!',
        icon: 'info',
        cancelButtonText: 'Not now!',
        showCancelButton: true,
        confirmButtonText: 'Go login',
        
      }).then((rs) => { 
        if(rs.isConfirmed) {
          navigate(`/${path.LOGIN}`)
        }
       })
      const response = await apiUpdateCart({pid: productData?._id, color: productData?.color})
      if(response.success) {
        toast.success(response.mes)
        dispatch(getCurrent())
      }
      else toast.error(response.mes)
    }
    if (flag === 'WISHLIST') console.log('WISHLIST')
    if (flag === 'QUICK_VIEW') {
      dispatch(showModal({ isShowModal: true, modalChildren: <DetailProduct isQuickView data={{ pid: productData._id, category: productData.category }} /> }))
    }

  }
  return (
    <div className='w-full text-base px-[10px]'>
      <div
        className='w-full p-[15px] border flex-col items-center block'
        onMouseEnter={(e) => {
          e.stopPropagation()
          setisShowOption(true)
        }
        }
        onMouseLeave={(e) => {
          e.stopPropagation()
          setisShowOption(false)
        }
        }
        onClick={() => navigate(`/${productData?.category.toLowerCase()}/${productData?._id}/${productData?.title}`)}
      >
        <div className='w-full relative flex justify-center'>
          {isShowOption && <div className='gap-2 absolute bottom-[-10px] flex left-0 right-0 justify-center animate-slide-top'>
            <span
              title='Quick view'
              onClick={(e) => handleClickOptions(e, 'QUICK_VIEW')}
            >
              <SelectOption icon={<AiFillEye />} />
            </span>
            {current?.cart.some(el => el.product === productData?._id.toString()) 
            ? <span
              title='Added to cart'
              // onClick={(e) => handleClickOptions(e, 'CART')}
            ><SelectOption icon={<BsCartCheckFill color='green' />} />
            </span> 
            : <span
            title='Add to cart'
            onClick={(e) => handleClickOptions(e, 'CART')}
          ><SelectOption icon={<FaCartPlus />} />
          </span>}
            <span
              title='Add to wishlist'
              onClick={(e) => handleClickOptions(e, 'WISHLIST')}
            >
              <SelectOption icon={<BsFillHeartFill />} />
            </span>
          </div>}
          <img
            src={productData?.thumb || 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'} 
            alt='product image' 
            className='w-[274px] h-[274px] object-cover'/>
          {!normal && <img src={isNew ? label : trending} alt='' className='absolute w-[100px] h-[35px] top-[0] right-[0] object-cover'/>}
        </div>
        <div className='flex flex-col mt-[15px] items-start w-full'>
          <span className='flex h-4'>{renderStartFromNumber(productData?.totalRatings)?.map((el, index) => (
            <span key={index}>{el}</span>
          ))}</span>
          <span className='line-clamp-1'>{productData?.title}</span>
          <span>{`${formatMoney(productData?.price)} VND`}</span>
        </div>
      </div>
    </div>
  )
}

export default withBaseComponent(memo(Product))