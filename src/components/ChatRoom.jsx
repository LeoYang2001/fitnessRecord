import { arrayUnion, doc, getDoc, onSnapshot, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { themeColor } from '../constants'
import { db } from '../firebase'
import ChatMessageCell from './ChatMessageCell'
import ProfileImage from './ProfileImage'

const ChatRoom = ({roomId}) => {

  const [roomInfo, setRoomInfo] = useState(null)
  const LOCAL_USER = useSelector((state) => state.LOCAL_USER.user)
  const [messageContent, setMessageContent] = useState('');
  const [members, setMembers] = useState({})

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [roomInfo])

  useEffect(() => {
    if(!roomId) return

    const roomRef = doc(db, 'rooms', roomId);

    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if(docSnap.exists())
      {
        const roomData = docSnap.data()
        setRoomInfo(roomData);
      }
      else{
        console.log('Room does not exist')
        setRoomInfo(null)
      }
    }, (error) => {
        console.error('Error fetching room data: ', error);
    }
     
    )

    return () => unsubscribe();

  }, [roomId])

  useEffect(() => {
    if (!roomInfo?.attendants) return;

    const fetchMembersInfo = async () => {
      const membersInfo = await Promise.all(
        roomInfo.attendants.map(async (attId) => {
          if (attId === LOCAL_USER.uid) return null;
          const userRef = doc(db, 'users', attId);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            return { [attId]: userDoc.data() }; // Create an object with attId as key and user data as value
          }
          return null;
        })
      );
    
      // Merge the objects into a single object
      const membersObject = membersInfo.reduce((acc, member) => {
        if (member !== null) {
          return { ...acc, ...member };
        }
        return acc;
      }, {});
    
      setMembers(membersObject);
    };

    fetchMembersInfo();
  }, [roomInfo]);


  const sendMessage = async () => {
    if(!messageContent.trim()) return

    const roomRef = doc(db, 'rooms', roomId)
    const newMessage = {
      messageId: `${Date.now()}_${LOCAL_USER.uid}`,
      created: Timestamp.now(),
      sender: LOCAL_USER.uid,
      content: messageContent,
      picUrl:'',
      checkIn:''
    }

    await updateDoc(roomRef, {
      messages: arrayUnion(newMessage)
    })

    setMessageContent('')
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };
  
  return (
    <div className='text-white text-3xl font-bold w-full h-full flex'>
    {roomInfo ? (
      <>
        <main  style={{ backgroundColor: 'gray'}} className=' flex-1  h-full flex chatRoomStyle flex-col  justify-start  p-6 px-10'>
          <header className=' overflow-hidden border-b-2'  >
            <ul className=' flex gap-2'>
            <ProfileImage profileImageUrl={LOCAL_USER.profileImageUrl} imageSize = {32}/>
              {
                Object.values(members).map((memberInfo, index) => (
                  <ProfileImage key={index} profileImageUrl={memberInfo.profileImageUrl} imageSize = {32}/>
                ))
              }
            </ul>
          </header>
          <div style={{height: '86%'}} className=' w-full  mb-auto custom-scrollbar'>
            <ul>
              {roomInfo.messages?.map((message, index) => (
                <li key={message.messageId}>
                  <ChatMessageCell 
                  memberInfo={members[message.sender]}
                  content={message.content}
                  ifUser={message.sender == LOCAL_USER.uid}
                  />
                   <div ref={messagesEndRef} />
                </li>
              ))}
            </ul>
          </div>
          <div className=' text-black w-full  flex' >
          <input
                style={{width: '80%'}}
                type="text"
                placeholder='type...'
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button className='bg-white ml-auto' onClick={sendMessage}>Send</button>
          </div>
        </main>
        <div style={{width: '20%'}} className='h-full border'>
              <span className=' text-3xl font-bold '>
                 {roomId}
              </span>
        </div>
      </>
    ) : (
      <p>Loading room info...</p>
    )}
  </div>
  )
}

export default ChatRoom