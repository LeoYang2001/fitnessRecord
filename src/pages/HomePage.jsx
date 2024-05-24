import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db, storage } from '../firebase';
import { useNavigate, Outlet, NavLink } from 'react-router-dom';
import { doc, setDoc, getDoc, query, collection, getDocs, where, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


import UserProfileModal from '../components/UserProfileModal';
import { themeColor } from '../constants';
import DailyWeight from './DailyWeight';
import { useSelector ,  useDispatch } from 'react-redux';
import { setLocalUser } from '../slices/userSlice';
import { setNavBar } from '../slices/navBarSlice';
import ProfileImage from '../components/ProfileImage';
import ModalComp from '../components/ModalComp';
import { setCalendarSideBar } from '../slices/calendarSideBarSlice';
import { setWeightRecords } from '../slices/weightRecordsSlice';
import { setDietRecords } from '../slices/dietRecordsSlice';
 
const   HomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const LOCAL_USER = useSelector((state) => state.LOCAL_USER.user)
    const navBar = useSelector((state) => state.navBar.value)
    const modal = useSelector((state) => state.modal.value)
    const calendarSideBar = useSelector((state) => state.calendarSideBar.value)

    const subRoutes = [
        {
            path:'/home',
            navName:'Dashboard',
            ifEnd:true
        },
        {
            path:'/home/dailyWeight',
            navName:'Weight',
            ifEnd:false
        },
        {
            path:'/home/dailyDiet',
            navName:'Diet',
            ifEnd:false
        }
    ]

    const [isProfileComplete, setIsProfileComplete] = useState(true);
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState(null);
    const [ifProfileCard, setIfProfileCard] = useState(false)
    const iconSize = 24
    
 
    const handleLogout = () => {               
        signOut(auth).then(() => {
        // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
        // An error happened.
        });
    }
 
    useEffect(()=>{
        onAuthStateChanged(auth, async (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              const uid = user.uid;
              setUserId(uid);
                const userDoc = await getDoc(doc(db, "users", uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data()
                    setUser(userData);
                    dispatch(setLocalUser(userData))
                    setIsProfileComplete(true);
                    
                  
                } else {
                    console.log('profile have not been created yet!')
                    setIsProfileComplete(false);
                }
            } else {
              // User is signed out
              // ...
              console.log("user is logged out")
              navigate("/");
            }
          });
         
    }, [navigate,isProfileComplete])

    // Fetch Weight Records  
    useEffect(() => {
        let uid = userId;
        const fetchWeightRecords = async (uid) => {
            if (!uid) return;
            try {
                console.log('fetching records...')
                const docRef = doc(db, 'weightRecords', uid);
                const unsubscribe = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        const records = data.records || {};
                        dispatch(setWeightRecords(records));
                        console.log(records)
                    } else {
                        console.log("No weight document!");
                        dispatch(setWeightRecords({}));
                    }
                });
    
                return unsubscribe; // Cleanup function to unsubscribe when component unmounts
            } catch (error) {
                console.error("Error fetching weight records: ", error);
            }
        };
        const unsubscribe = fetchWeightRecords(uid);
    
        return () => unsubscribe; 
    }, [userId, dispatch])


    // Fetch diet Records  
    useEffect(() => {
        let uid = userId;
        const fetchDietRecords = async (uid) => {
            if (!uid) return;
            try {
                const docRef = doc(db, 'dietRecords', uid);
                const unsubscribe = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        const records = data || {};
                        dispatch(setDietRecords(records))
                    } else {
                        console.log("No dieting document!");
                        dispatch(setDietRecords({}));
                    }
                });
    
                return unsubscribe; // Cleanup function to unsubscribe when component unmounts
            } catch (error) {
                console.error("Error fetching weight records: ", error);
            }
        };
        const unsubscribe = fetchDietRecords(uid);
    
        return () => unsubscribe; 
    }, [userId, dispatch])
    
  

    const handleSaveProfile = async (profileData) => {
        try {
            const { firstName, lastName, fitnessGoal, startingWeight, profileImage } = profileData;
            const userDoc = doc(db, "users", userId);
            const profileImageRef = ref(storage, `profileImages/${userId}`);
            await uploadBytes(profileImageRef, profileImage);
            const profileImageUrl = await getDownloadURL(profileImageRef);

            await setDoc(userDoc, {
                uid:userId,
                firstName,
                lastName,
                fitnessGoal,
                startingWeight,
                profileImageUrl,
                ifRecordToday: false
            });

            setIsProfileComplete(true);
        } catch (error) {
            console.error("Error saving profile data", error);
        }
    };
 
  return (
    <section  className=' w-full h-full flex absolute' style={{backgroundColor: themeColor.backgroundColor}}> 
        {
            isProfileComplete && (
                <nav className={`h-full text-white border flex flex-col  text-nowrap  justify-start navBar ${navBar && 'navBar-expended'}`}>
            <header className='welcome-header mb-6  relative justify-center items-center'>
                <span style={{left:'50%'}} className=' text-lg absolute font-semibold'>Logo</span>
            </header>
            {
                subRoutes.map((navItem)=>(
                    <NavLink 
                    key={navItem.path}
                    style={({ isActive, isPending, isTransitioning }) => {
                        return {
                        fontWeight: isActive ? "bold" : "",
                        color: isActive ? "white" : "gray",
                        viewTransitionName: isTransitioning ? "slide" : "",
                        };
                    }}
                    to={navItem.path}  end={navItem.ifEnd} >
                        <span className=' text-md font-semibold'>{navItem.navName}</span>
                    </NavLink>
                ))
            }
            <footer className=' mb-6 mt-auto'>
            <span className=' w-full flex cursor-pointer pointerFocus  items-center justify-center gap-2' onClick={handleLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize - 4} height={iconSize - 4} fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
            </svg>
                            Sign out</span>
            </footer>
        </nav>
            )
        }
        <main className='flex-1 flex flex-col h-full relative '>
                {/* profileCard Mask */}
                {
                    (ifProfileCard || navBar) && (
                        <div onClick={()=>{
                            setIfProfileCard(false)
                            dispatch(setNavBar(false))
                        }} className=' absolute z-10 w-full bg-transparent h-full transparent'></div> 
                    )
                }      
                 {/* Invite Your friend modal */}
                <ModalComp modal={modal} />  
            <header className=' welcome-header select-none  relative items-center  justify-between'>
                {/* menu icon  */}
                <svg onClick={()=>{
                    dispatch(setNavBar(true))
                    dispatch(setCalendarSideBar(false))
                    
                }} xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} fill="#fff" className="pointerFocus bi bi-list" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>
                {/* logo  */}
                {
                    !navBar && (
                        <span className=' text-lg font-semibold text-white absolute' style={{left:'50%', transform:[{translateX:'-50%'}]}}>Logo</span>
                    )
                }
                {/* profile info  */}
                <div onClick={()=>{setIfProfileCard(true)}} style={{width:400}} className={` ${calendarSideBar ? 'calendar-profile-extended calendar-profile' : 'calendar-profile'} h-full flex  flex justify-end items-center pr-10  gap-2`}>
                   <div className=' pointerFocus flex justify-normal items-center gap-2'>
                   <ProfileImage profileImageUrl={LOCAL_USER?.profileImageUrl} imageSize={32} />
                    <span>{LOCAL_USER?.firstName}</span>  
                    </div> 
                </div>

                {/* profile card  */}
                {
                    ifProfileCard && (
                        <div style={{top:'100%', backgroundColor:'rgba(255,255,255,1'}}  className=' z-20 w-48 flex flex-col border rounded-md shadow-md items-center p-4 absolute right-6'>
                            
                            <ProfileImage profileImageUrl={LOCAL_USER?.profileImageUrl} imageSize={80} />
                            <span className='my-4 font-semibold'>{LOCAL_USER?.firstName} {LOCAL_USER?.lastName}</span>   
                            {/* profile setting  */}
                            <nav onClick={()=>{}} className='profileCard flex flex-col w-full  pb-4 gap-3 text-sm'>
                                <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width={iconSize - 4} height={iconSize - 4} fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                                </svg>      
                                    Profile
                                </span>
                                <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width={iconSize - 4} height={iconSize - 4} fill="currentColor" className="bi bi-bullseye" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10m0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12"/>
                                <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8"/>
                                <path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                </svg>
                                    Fitness Goal</span>
                                <div style={{height:1}} className=' w-full my-2  bg-gray-300'></div>
                                <span  onClick={handleLogout}>
                                <svg xmlns="http://www.w3.org/2000/svg" width={iconSize - 4} height={iconSize - 4} fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
        <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
        </svg>
                                    Sign out</span>
                            </nav>
                            
                        </div>
                    )
                }
            </header>
            <section className=' w-full overflow-y-scroll custom-scrollbar flex-1 '>
           {
            LOCAL_USER && (
                <Outlet/>
            )
           }
            </section>
                {!isProfileComplete && (
                    <UserProfileModal
                        isOpen={!isProfileComplete}
                        onClose={() => setIsProfileComplete(true)}
                        onSave={handleSaveProfile}
                    />
                )}
        </main>
    </section>
  )
}
 
export default HomePage