import React, { useEffect, useState} from 'react'

const useDebounse = (value, ms) => {
    const [debounceValue, setDebounceValue] = useState('')
    useEffect(() => {
        const setTimeOutId = setTimeout(() => {
            setDebounceValue(value)
        },ms)

        return () => {
            clearTimeout(setTimeOutId)
        }
    },[value, ms])
  return debounceValue
}

export default useDebounse


//khi mà nhập thay đổi giá sẽ gọi api 
//vấn đề: onchange của input sẽ thay đổi và gọi api liên tục theo mỗi lượt nhập
//giải quyết: chỉ gọi api khi mà người dùng nhập xong
//thời gian onchange của input


//để lm được phải tách price thành 2 biến
//1. biến là để phục vụ UI , gõ tới đâu thì lưu tới đó 
//2. biến dùng để quyết định dùng để call api => setTimeout => biến sẽ được gán sau khi một khoản thởi gian 
