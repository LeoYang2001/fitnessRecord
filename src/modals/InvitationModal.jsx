import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import React from 'react'
import { useRef } from 'react'
import { useEffect , useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { themeColor } from '../constants'
import { db } from '../firebase'
import { setModal } from '../slices/modalSlice'
import { hexWithOpacity } from '../utility'

const InvitationModal = () => {

    const dispatch = useDispatch()
    const inputRefs = useRef([]);
    const navigate = useNavigate()

    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const [code, setCode] = useState(null)
    const LOCAL_USER = useSelector((state) => state.LOCAL_USER.user)

    useEffect(()=>{
        let code = digits.join("")
        setCode(code)
    }, [digits])

    useEffect(() => {
        inputRefs.current[0].focus();
    }, []);

    const joinRoom = async (roomNum, userUid) => {
        const roomRef = doc(db, "rooms", roomNum);
        const roomDoc = await getDoc(roomRef);
        const userRef = doc(db, "users", userUid);

        
        // Check if the room exists
        if (!roomDoc.exists()) {
            throw new Error("Room does not exist");
        }

        // Add the user to the room's attendants
        await updateDoc(roomRef, {
            attendants: arrayUnion(userUid)
        });

        // Update the user's document to include the new room ID
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            // If the user document exists, update the roomIds array
            await updateDoc(userRef, {
                roomIds: arrayUnion(roomNum)
            });
        } else {
            // If the user document doesn't exist, create it with the roomIds array
            await setDoc(userRef, {
                roomIds: [roomNum]
            });
        }
        alert(`You have joined Room number: ${roomNum}`);

    };

    const handleJoinRoom = async () => {
        if(LOCAL_USER)
        {
            try {
                await joinRoom(code, LOCAL_USER.uid)
                console.log("Joined room with code:", code);
                navigate("/home/fitRoom")
                dispatch(setModal(null))
            } catch (error) {
                console.error("Error joining room:", error);
            }
        }
    }

    const handleKeyDown = (index, e) => {
        
        const value = e.key;
        const curValue = inputRefs.current[index].value

        if (!/^[0-9]$/.test(value) && value !== 'Backspace') {
            return;
        }
    
        
        if(value !== 'Backspace')
        {

        
                // Update the digits state with the new value
            setDigits(prevDigits => {
                const newDigits = [...prevDigits];
                newDigits[index] = value;
                return newDigits;
            });
            const nextIndex = index + 1;
            if (value.length === 1 && nextIndex < inputRefs.current.length) {
                    inputRefs.current[nextIndex].focus();
                }
           
        }
        else{
            if ( curValue == '' && index > 0)
            {
                inputRefs.current[index - 1].focus();
            }
            else{
                setDigits(prevDigits => {
                    const newDigits = [...prevDigits];
                    newDigits[index] = '';
                    return newDigits;
                });
            }
        }


        

    }

  return (
    <div className=' absolute z-10 w-full h-full flex flex-col justify-center items-center gap-20'>
        <div onClick={()=>{dispatch(setModal(null))}} className='absolute w-full h-full' style={{backgroundColor: 'rgba(0,0,0,0.4)'}}></div>
           <main style={{width: 500, height:400}} 
           className='bg-white z-20 flex flex-col items-center gap-4 rounded-xl modal-invitation p-6 py-16 relative'>

            <header className=' font-bold text-3xl flex-col flex  items-center'>
                Invite Your Friends
                <span className=' text-lg text-gray-500'>put your friend's code</span>
            </header>

            {/* close btn  */}
            <div onClick={()=>{dispatch(setModal(null))}} className=' border absolute top-6 right-6 rounded-md pointerFocus'>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                </svg>
            </div>
           <div className=' flex mt-6'>
           {digits.map((digit, index) => (
                <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    maxLength={1}
                    className="border text-center text-2xl font-semibold rounded-md"
                    style={{ width: '2rem', marginRight: '0.5rem',caretColor:'transparent' }}
                    value={digit}
                  
                    onKeyDown={(e)=>{handleKeyDown(index,e)}}
                />
            ))}
           </div>
            
         
            {
                code ? (
                    <div className=' absolute font-semibold  bottom-6 pointerFocus' >
                        create a room
                    </div>
                ) : (
                    <div  className={`mt-auto  select-none text-white px-10 py-2 text-2xl font-semibold rounded-lg pointerFocus`} style={{ backgroundColor:  themeColor.backgroundColor }}>
                    create a room
                </div>
                )
            }

            {
                code?.length === 6 ? (
                    <div onClick={handleJoinRoom} className={`mt-auto  select-none text-white px-10 py-2 text-2xl font-semibold rounded-lg pointerFocus`} style={{ backgroundColor: themeColor.backgroundColor }}>
                    Join!
                </div>
                ):(
                    <div className=' absolute font-semibold  bottom-6' >
                </div>
                )
            }
            
           </main>
           {/* divider  */}
           <div className=' w-2 h-2 bg-transparent' > </div>
    </div>
  )
}

export default InvitationModal