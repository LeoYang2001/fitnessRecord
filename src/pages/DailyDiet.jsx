import dayjs from 'dayjs'
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CalendarCom from '../components/CalendarCom'
import Loading from '../components/Loading'
import PicCardItem from '../components/PicCardItem'
import PicUploadButton from '../components/PicUploadButton'
import { db, storage } from '../firebase'
import { setCalendarSideBar } from '../slices/calendarSideBarSlice'

const DailyDiet = () => {

  const calendarSideBar = useSelector((state) => state.calendarSideBar.value)
  const dispatch = useDispatch()
  const today = dayjs().format('YYYY-MM-DD');
  const [dateVal, setDateVal] = useState(dayjs(today))
  const LOCAL_USER = useSelector((state) => state.LOCAL_USER.user)
  const dietRecords = useSelector((state)=> state.dietRecords.value)
  const [meals, setMeals] = useState(dietRecords[dateVal.format("YYYY-MM-DD")] ? dietRecords[dateVal.format("YYYY-MM-DD")] : [])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(()=>{
    
    let curDateMeals = dietRecords[dateVal.format("YYYY-MM-DD")] 
    setMeals(curDateMeals ? curDateMeals : [])
    console.log(dietRecords)
  },[dateVal, dietRecords])

 
 

  const handleUpload = async (newImage) =>{

    const mealImageRef = ref(storage, `mealImages/${LOCAL_USER.uid}-${dateVal.format('YYYY-MM-DD')}-${meals.length + 1}`)
    await uploadBytes(mealImageRef, newImage);
    const mealImageUrl = await getDownloadURL(mealImageRef);

    const dummyMeal = { 
      mealNth: meals.length + 1,
      mealImgUrl: mealImageUrl,
      mealCal: 450,
      mealCarbs: 50,
      mealFats: 15,
      mealProtein:65
    }

    setMeals(prevRecords => [...prevRecords, dummyMeal])
  }
  
  const uploadDietRecords = async (uid, date, meals) => {
    const docRef = doc(db, 'dietRecords', uid);
    // const formattedDate = dateVal.format("YYYY-MM-DD")

    try {
      const docSnap = await getDoc(docRef)
      if(!docSnap.exists()){
        await setDoc(docRef, {[date]:meals});
      }else{
        await updateDoc(docRef, {
          [date] : arrayUnion(...meals)
        })
      }
      // await setDoc(docRef, {[formattedDate]:meals});

      console.log('diet records updated successfully!')

    } catch (error) {
      console.error("Error updating diet records: ", error);
    }
  }

  const handleUploadDietRecords = async () => {
    if(meals.length === 0)  return alert('no meal has been uploaded')
    setIsLoading(true)
    const uid = LOCAL_USER.uid;
    const date = dateVal.format('YYYY-MM-DD');
    await uploadDietRecords(uid, date, meals);
    setIsLoading(false)
  }


  return (
    <section className=' page-weight flex  h-full'>
      <div className=' w-full h-full pl-16  relative flex-1 flex-col flex text-white flex-wrap'>
          <span className=' mt-8'>
              date: {dateVal.format("YYYY-MM-DD")}
          </span>
          <div className=' flex-1 flex w-full gap-10 flex-wrap  custom-scrollbar pr-8'>
          {
          meals?.map((mealItem, index) => (
             <PicCardItem key={index} mealInfo = {mealItem} />
          ))
        }
        <PicUploadButton onUpload={handleUpload}/>
          </div>
          <div className='  absolute bottom-16 right-10'>
            {
              !isLoading ? (
                <span  onClick={handleUploadDietRecords} className="pointerFocus">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-floppy" viewBox="0 0 16 16">
              <path d="M11 2H9v3h2z"/>
              <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
              </svg>
            </span>
              ):(
                <Loading fontStyle={{iconSize:24, color:'green'}} />
              )
            }
          </div>
      </div>
       {/* calendar  */}

       <div style={{width: 50}} className={`h-full flex flex-col ${calendarSideBar ? 'calendar-sidebar-extended calendar-sidebar calendar-sidebar' : 'calendar-sidebar'} pt-4 items-center relative px-4`}>
              {
                !calendarSideBar ? (
                  <span className='pointerFocus'>
                  <svg  onClick={()=>{
                    dispatch(setCalendarSideBar(true))
                  }}  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fff" className="bi bi-calendar3" viewBox="0 0 16 16">
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
                  <CalendarCom dateVal={dateVal} setDateVal={setDateVal} records={dietRecords}/>
                  </>
                )
              }
         </div>
    </section>
  )
}

export default DailyDiet