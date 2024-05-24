import React from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CalendarCom from '../components/CalendarCom'
import WeightOffset from '../components/WeightOffset'
import { setCalendarSideBar } from '../slices/calendarSideBarSlice'
import dayjs from 'dayjs';
import { db } from '../firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { getLastRecordWeight } from '../utility'


const DailyWeight = () => {

  const [weight, setWeight] = useState('')
  const inputRef = useRef(null)
  const navBar = useSelector((state) => state.navBar.value)
  const LOCAL_USER = useSelector((state) => state.LOCAL_USER.user)
  const weightRecords = useSelector((state) => state.weightRecords.value)
  const calendarSideBar = useSelector((state) => state.calendarSideBar.value)
  const dispatch = useDispatch()
  const [weightOffSet, setWeightOffSet] = useState(null)
  
  const [shownWeight, setShownWeight] = useState('')
  const today = dayjs().format('YYYY-MM-DD');
  const [dateVal, setDateVal] = useState(dayjs(today))
  

  useEffect(() => {
    //reset input weight
    setWeight('')
    if(weightRecords[dateVal.format('YYYY-MM-DD')])
    {
      setShownWeight(weightRecords[dateVal.format('YYYY-MM-DD')].weight)

    }
    else{
      setShownWeight(null)
    }
  }, [dateVal, weightRecords])
  

  useEffect(() => {
    let lastWeight = getLastRecordWeight(weightRecords, dateVal.format('YYYY-MM-DD'))
    if(weight && lastWeight)
    {
      setWeightOffSet(weight - lastWeight)
    }
    else{
      setWeightOffSet(0)
    }
  }, [weight, dateVal])
  

  useEffect(() => {
    if(inputRef)
    {
      inputRef?.current?.focus()
    }
  }, [navBar])
  

  const handleChange = (e)=>{
      const val = e.target.value

      if(val.length > 3) return

      setWeight(val)
  }

  const handleUploadWeight = async () => {
    try {
      const weightDocRef = doc(db, 'weightRecords', LOCAL_USER.uid);
      const userDocRef = doc(db, 'users', LOCAL_USER.uid);
  
      const formattedDate = dateVal.format('MM-DD-YYYY');
      const dateKeyVal = dateVal.format('YYYY-MM-DD');
      const today = dayjs().format('MM-DD-YYYY'); 
  
      // Fetch the existing document
      const docSnap = await getDoc(weightDocRef);
  
      if (docSnap.exists()) {
        // If the document exists, update the records array
        const existingData = docSnap.data();
        const updatedRecords = {
          ...existingData.records,
          [dateKeyVal]: { date: formattedDate, weight }
        };
  
        await setDoc(weightDocRef, {
          ...existingData,
          records: updatedRecords
        });
      } else {
        // If the document does not exist, create it with the initial weight record
        await setDoc(weightDocRef, {
          uid: LOCAL_USER.uid,
          username: `${LOCAL_USER.firstName} ${LOCAL_USER.lastName}`,
          records: {
            [dateKeyVal]: { date: formattedDate, weight }
          }
        });
      }
  
      console.log("Weight data saved successfully");
      alert("Weight data saved successfully");
  
      // If the date of the uploaded record is today, update ifRecordToday to true
      if (formattedDate === today) {
        await updateDoc(userDocRef, {
          ifRecordToday: true
        });
      }
    } catch (error) {
      console.error("Error saving weight data", error);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && weight) {
      // Trigger your desired function here
      const cfm = window.confirm(`do you want to upload the weight (${weight}lbs) at the date of ${dateVal.format('MM-DD-YYYY')}`)
      if(cfm)
      {
        await handleUploadWeight()
      }
    }
  };

  return (
    <section className='page-weight text-white flex h-full'>
         <div className=' w-full h-full   p-16 pt-8  flex-1 flex flex-col'>
            <header className=' flex flex-col gap-4'>
                <span className=' text-3xl font-semibold'> Did you weigh yourself at the date of {dateVal.format('MM-DD-YYYY')}? </span>
                <span className=' text-md text-gray-300 '>Put your daily weight here, let us keep you in track</span>
            </header>
            <main 
            className='text-4xl  mt-10 flex flex-col w-full flex-1 items-center justify-center'>
                {!shownWeight && (<span className=' mb-10'>you have not weighed yourself yet</span>)}
              <div className=' relative '>
                  {
                    shownWeight ? (
                      <>
                        <span>
                          You weigh {shownWeight} lbs at the date of {dateVal.format('MM-DD-YYYY')}
                        </span>
                      </>
                    ):(
                      <>
                        <input type="number"
                          onChange={handleChange}  
                          ref={inputRef}
                          maxLength={3}  
                          style={{ width: '3ch', borderBottom: '1px solid gray'}}
                          value={weight}
                          onKeyDown={handleKeyDown}
                          className=" bg-transparent  text-center outline-none " />
                          <span className='ml-2 text-gray-300 '>lbs</span>
                          {
                            weight.length >= 2 && (
                              <span className=' absolute' style={{ left:'110%' }}>
                                <WeightOffset offset={weightOffSet} />
                              </span>
                            )
                          }
                      </>
                    )

                  }
              </div> 
              

              {/* divider  */}
              <div className='  w-80 flex justify-end mt-20 h-20'>
              </div>
              
            </main>
         </div>
         {/* calendar  */}

         <div style={{width: 50}} className={`h-full flex flex-col ${calendarSideBar ? 'calendar-sidebar-extended calendar-sidebar calendar-sidebar' : 'calendar-sidebar'} pt-4 items-center relative px-4`}>
              {
                !calendarSideBar ? (
                  <span className='pointerFocus'>
                  <svg  onClick={()=>{
                    dispatch(setCalendarSideBar(true))
                  }}  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-calendar3" viewBox="0 0 16 16">
                  <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z"/>
                  <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                  </svg>
              </span>
                ):(
                  <>
                    <span className=' w-full flex justify-between items-center '>
                     <svg onClick={()=>{
                      dispatch(setCalendarSideBar(false))
                     }} xmlns="http://www.w3.org/2000/svg" width="28" height="28"fill="#000" className="bi bi-justify-left pointerFocus-invert" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
                    </svg>

                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000" className="bi bi-calendar3" viewBox="0 0 16 16">
                    <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z"/>
                    <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                    </svg>
                  </span>
                  <span className=' text-black text-xl font-semibolds'>
                    Select a date
                  </span>
                  <CalendarCom dateVal={dateVal} setDateVal={setDateVal} records={weightRecords} />
                  </>
                )
              }
         </div>
    </section>
  )
}

export default DailyWeight