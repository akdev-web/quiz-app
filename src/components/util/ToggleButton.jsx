import React, { useState } from 'react'

const ToggleButton = ({size}) => {
    const [dBtn,setDbtn] = useState(false)

    let height = size;
    let width = size*2;
    return (
        <div style={{width,height}} onClick={() => setDbtn(prev => !prev)}>
            <div className={`relative w-full h-full p-[2px] rounded-full bg-gray-300  ${dBtn ? 'bg-white' : 'bg-gray-300'}`}>
                <div className={`relative w-[50%] h-full rounded-full  ${dBtn ? 'translate-x-full bg-gray-800' : 'bg-gray-700'} transition-transform duration-300`}></div>
            </div>
        </div>
    )
}

export default ToggleButton