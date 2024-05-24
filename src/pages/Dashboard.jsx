import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import BasicLineChart from '../Charts/BasicLineChart'
import ProfileImage from '../components/ProfileImage'
import WeightOffset from '../components/WeightOffset'
import { themeColor } from '../constants'
import { setModal } from '../slices/modalSlice'
import { analyzeWeightRecord, hexWithOpacity } from '../utility'


const Dashboard = () => {
    const LOCAL_USER = useSelector((state) => state.LOCAL_USER.user)
    const dispatch = useDispatch();
    const iconSize = 28
    const weightRecords = useSelector((state) => state.weightRecords.value)
    const [weightStat, setWeightStat] = useState(analyzeWeightRecord(weightRecords))
    const navBar = useSelector((state) => state.navBar.value)

    useEffect(() => {
      let weightStatistics = analyzeWeightRecord(weightRecords)
      setWeightStat(weightStatistics)
      console.log('initial', weightRecords)

    }, [weightRecords])
    

  return (
    <section className='text-white page flex-col '>
        <header className=' flex flex-col gap-4'>
            <span className=' text-3xl font-semibold'> Welcome Back, {LOCAL_USER?.firstName}</span>
            <span className=' text-md text-gray-300 '>Here's an overview of your weight tracking</span>
        </header>
        <main className=' mt-10 flex flex-col w-full flex-1 items-center'>
            {
              Object.keys(weightRecords).length === 0 ? (
                <span>Start record your first day weight</span>
              ):(
               <>
                 <span className='text-2xl self-start font-semibold'>You dropped <span className=' text-green-500'>{weightStat?.originalWeight - weightStat?.latestWeight} lbs</span> in last {weightStat.daysPassed} days! </span>
            <div className=' mt-10  h-full w-full flex   justify-center '>
                {/* <EChartsLineChart/> */}
                <BasicLineChart/>
            </div>
               </>
              )
            }
            <span className='text-2xl font-semibold self-start my-4'>Your Friends </span>
            <section  style={{width:"60%" , backgroundColor:  hexWithOpacity(themeColor.backgroundColor, 1.4)}} className=' flex flex-col p-4 rounded-md shadow-lg'>
                  <header style={{borderBottom:`1px solid ${hexWithOpacity("#fff", 0.6)}`}} className=' w-full flex  p-2 font-semibold'>
                      <span className=' flex-1'>
                      Username
                    </span>
                    <span  className=' flex-1'>
                      Goal
                    </span>
                    <span >
                      Weight offset
                    </span>
                  </header>
                  <div className=' flex justify-center items-center  font-semibold p-2 pointerFocus' >
                  <span className=' flex-1 flex items-center gap-2'>

                     <ProfileImage profileImageUrl={LOCAL_USER.profileImageUrl} imageSize={32} />
                     Leo Yang

                    </span>
                    <span  className=' flex-1'>
                      Cutting
                    </span>
                    <span >
                      <WeightOffset offset={-6} />
                    </span>
                  </div>
                  <div onClick={()=>{
                        dispatch(setModal('invitation'))
                      }} className=' pointerFocus flex justify-center items-center gap-6 text-2xl font-semibold m-4 p-2 rounded-xl' style={{backgroundColor: hexWithOpacity(themeColor.backgroundColor, 2)}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} fill="currentColor" className="bi bi-person-plus-fill" viewBox="0 0 16 16">
                      <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                      <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"/>
                    </svg>
                      <span>Invite your friend</span>
                  </div>
            </section>
        </main>
    </section>
  )
}

export default Dashboard