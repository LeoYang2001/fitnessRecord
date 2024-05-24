import React from 'react'

const WeightOffset = ({offset}) => {
    const ifLose = offset < 0
    if(offset == 0)     return
  return (
    <div className=' flex items-center font-semibold '>
        {
           !ifLose ? (
                    <img className=' rotate-180' src="/gain.png" alt="" />
            ):(
                
                    <img src="/lose.png" alt="" />
            )
        }
                    <span style={{color: ifLose ? '#61ED79': '#ED7161' }}>{Math.abs(offset)}</span>

    </div>
  )
}

export default WeightOffset