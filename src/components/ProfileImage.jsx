import React from 'react'

const ProfileImage = ({profileImageUrl, imageSize}) => {
  return (
    <div style={{width: imageSize, height: imageSize}} className=' rounded-full border border-transparent overflow-hidden'>
        {
            profileImageUrl ? (
                <img  src={profileImageUrl} alt="" />
            ) : (
                <span className=' text-sm font-semibold'>error</span>
            )
        }
    </div>
  )
}

export default ProfileImage