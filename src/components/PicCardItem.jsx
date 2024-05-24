import React from 'react'
import { themeColor } from '../constants'
import { hexWithOpacity } from '../utility'

const PicCardItem = ({mealInfo}) => {
  return (
    <div style={{ height:350, width:300, backgroundColor: hexWithOpacity(themeColor.backgroundColor, 2.8)}}
     className=' 
      picCard
      p-2
      
     rounded-lg overflow-hidden flex flex-col justify-between'>
        <img style={{width:'100%', height:'70%'}}
         className='flex pointerFocus items-center rounded-lg justify-center overflow-hidden image' src={mealInfo?.mealImgUrl} alt="" />
         <div className=' w-full flex flex-col flex-1  py-4 justify-between'>
                <span className=' text-lg font-bold'>{mealInfo.mealCal}</span>
                <div className='flex justify-between'>
                    <span className=' text-sm font-semibold flex items-center gap-1'>Carbs: <p className=' font-normal'>{mealInfo.mealCarbs} </p> </span>
                    <span className=' text-sm font-semibold flex items-center gap-1'>Fats: <p className=' font-normal'>{mealInfo.mealFats}</p> </span>
                    <span className=' text-sm font-semibold flex items-center gap-1'>Proteins: <p className=' font-normal'>{mealInfo.mealProtein}</p> </span>
                </div>
         </div>
    </div>
  )
}

export default PicCardItem