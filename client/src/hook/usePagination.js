import { useMemo } from 'react'
import { generateRange } from '../utils/helper'
import {BiDotsHorizontalRounded} from 'react-icons/bi'

const usePagination = (totalProductCount, currentPage, siblingCount = 1) => {
  
    const paginationArray = useMemo(() => { 
        //số trang 
        const pageSize = process.env.REACT_APP_PRODUCT_LIMIT || 10
        const paginationCount = Math.ceil(totalProductCount / pageSize)
        const totalPaginationItem = siblingCount + 5

        if(paginationCount <= totalPaginationItem) return generateRange(1, paginationCount)

        const isShowLeft = currentPage - siblingCount > 2 
        const isShowRight = currentPage + siblingCount < paginationCount - 1
        if(isShowLeft && !isShowRight) {
            const rightStart = paginationCount - 4
            const rightRange = generateRange(rightStart, paginationCount)

            return [1, <BiDotsHorizontalRounded />, ...rightRange]
        }


        if(!isShowLeft && isShowRight) {
            const leftRange = generateRange(1,5)
            return [...leftRange, <BiDotsHorizontalRounded />, paginationCount]
        }

        const siblingLeft = Math.max(currentPage - siblingCount, 1)
        const siblingRight = Math.min(currentPage + siblingCount, paginationCount)
        

        if(isShowLeft && isShowRight) {
            const middleRange  = generateRange(siblingLeft, siblingRight)
            return [1, <BiDotsHorizontalRounded />, ...middleRange, <BiDotsHorizontalRounded />, paginationCount]
        }

     },[totalProductCount, currentPage, siblingCount])

    return paginationArray
}

export default usePagination

// logic hoạt động của component phân trang 
/**
 * first + last + current + sibling + 2*dots 
 * min = 6 => sibling + 5 
 * totalPagination(tổng số trang): 58, limitProduct = 10 => = 6 (58/10) = 5.8 thì lấy 6 sp, trường hợp ra số thập phân nhỏ hơn 5 thì lm tròn lên 6, sau đó lấy số thập phân nhân cho số sản phẩm cần lấy cho 1 trang (ở đây là 10) 
 * tổng số item phân trang: totalPaginationItem: sibling + 5 
 * sibling = 1
 * [1,2,3,4,5,6]
 * [1,...,6,7,8,9,10]
 * [1,2,3,4,5,...,10]
 * [1,...,5,6,7,..,10]
 */