import { arrayUnion, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ChatRoom from '../components/ChatRoom';
import { db } from '../firebase';

const FitRoom = () => {

    const LOCAL_USER = useSelector((state) => state.LOCAL_USER.user)

    const generateUniqueRoomCode = async () => {
        let code;
        let isUnique = false;
      
        while (!isUnique) {
            code = Math.floor(100000 + Math.random() * 900000).toString();
            const codeDoc = await getDoc(doc(db, "roomCodes", code));
            if (!codeDoc.exists()) {
                isUnique = true;
            }
        }
      
        // Store the generated code to ensure it's not reused
        await setDoc(doc(db, "roomCodes", code), { code });
        return code;
      };

      const createRoom = async (hostUid) => {
        const roomNum = await generateUniqueRoomCode();
        const roomRef = doc(db, "rooms", roomNum);
        const userRef = doc(db, "users", LOCAL_USER.uid);
    
        await setDoc(roomRef, {
            roomNum,
            host: hostUid,
            attendants: [hostUid],
            created: serverTimestamp()
        });


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
    
        alert(`your created Room number is : ${roomNum}`)
    };

    const [roomIds, setRoomIds] = useState([])
    const [roomId, setRoomId] = useState('')
    useEffect(() => {
       if(LOCAL_USER?.roomIds)
       {
        setRoomIds(LOCAL_USER.roomIds)
        setRoomId(roomIds[0])
       }
    }, [LOCAL_USER, roomIds])
    
    
    
  return (
    <div className=' w-full h-full border flex '>
           <div style={{width:'20%'}} className=' h-full flex flex-col border items-center overflow-y-auto'>
           <button className='border text-white' onClick={()=>{createRoom(LOCAL_USER.uid)}}>create a room</button>
           {roomIds?.map((roomId) => (
                    <div  key={roomId} className=' w-40 h-40 border text-white'>
                        <li onClick={()=>{setRoomId(roomId)}} >
                           {roomId}
                        </li>
                    </div>
            ))}
           </div>
           <div  className=' flex-1 '>
                <ChatRoom roomId={roomId}/>
           </div>
    </div>
  )
}

export default FitRoom