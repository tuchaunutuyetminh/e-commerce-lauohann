import React from 'react'

const Button = ({fw, children, handleOnclick, style, type='button'}) => {
  return (
    <button
        type={type}
        className={style ? style : `px-4 py-2 rounded-md text-white bg-main text-semibold my-2 ${fw ? 'w-full' : 'w-fit'}`}
        onClick={() => { handleOnclick && handleOnclick()}}
    >
        {children}
    </button>
  )
}

export default Button