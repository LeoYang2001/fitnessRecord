import React from 'react'
import { useSelector } from 'react-redux'
import ProfileImage from './ProfileImage'

const ChatMessageCell = ({memberInfo, content, ifUser}) => {

  const LOCAL_USER = useSelector((state) => state.LOCAL_USER.user)

  const imgSize = 32

  return (
    <div className=' my-2 text-black'>
        {
            !ifUser ? (
                    <div className=' w-full  p-2 flex gap-2 items-center '>
                        <div className=' self-start'>
                            <ProfileImage
                            profileImageUrl={memberInfo?.profileImageUrl}
                            imageSize={imgSize}
                            />
                        </div>
                        <span className=' text-lg  text-wrap bg-white p-2 rounded-lg rounded-tl-none'>
                            {content} 
                        </span>
                    </div>               
            ):(
                    <div className=' w-full  p-2 flex gap-2 items-center '>
                        <span className=' text-lg  ml-auto flex justify-end text-wrap bg-white p-2 rounded-lg rounded-tr-none'>
                            {content} 
                        </span>
                        <div className=' self-start'>
                            <ProfileImage
                            profileImageUrl={LOCAL_USER?.profileImageUrl}
                            
                            imageSize={imgSize}
                            />
                        </div>
                        
                    </div>
            )
        }
        </div>
  )
}

export default ChatMessageCell