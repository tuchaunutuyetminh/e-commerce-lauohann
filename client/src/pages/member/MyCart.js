import withBaseComponent from 'components/hocs/withBaseComponent'
import React, { memo } from 'react'

const MyCart = (props) => {
  return (
    <div>MyCart</div>
  )
}

export default memo(withBaseComponent(MyCart))