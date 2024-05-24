import React, { useState } from 'react';
import { themeColor } from '../constants';
import { hexWithOpacity } from '../utility';


const UserProfileModal = ({ isOpen, onClose, onSave }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [fitnessGoal, setFitnessGoal] = useState('');
    const [startingWeight, setStartingWeight] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null)

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
       if(file)
       {
        setProfileImage(file);
        const url = URL.createObjectURL(e.target.files[0])
        setPreviewImage(url)
       }
    };

    const handleSave = () => {
        if(!firstName || !lastName || !fitnessGoal || !startingWeight || !profileImage) return alert('form is not filled out')
        onSave({ firstName, lastName, fitnessGoal, startingWeight, profileImage });
    };

    if (!isOpen) return null;

    return (
        <div className="modal  w-full h-full flex absolute">
            <div style={{width:'40%'}} className=' h-full border bg-white  flex flex-col items-center'>
                <input 
                  type="file"
                  accept='image/*'
                  style={{ display:'none' }} 
                  id="profile-image-upload"
                    onChange={handleImageUpload} />
                    <label style={{height:'50%'}} className='  cursor-pointer w-full flex items-center flex-col justify-center' htmlFor="profile-image-upload">
                        {
                            previewImage ? (
                                    <div className='border-4 rounded-full w-48 h-48 bg-gray-200  flex justify-center overflow-hidden border-black' >
                                            <img  style={{width:'100%', height:'100%'}} src={previewImage} alt="" />
                                    </div>
                            ):(
                                    <div className='   relative'>
                                    <div className='pointerFocus border-4 rounded-full w-48 h-48 bg-gray-200  flex justify-center overflow-hidden border-black' >
                                            <img className='mt-6' style={{width:'90%', height:'90%'}} src="user.png" alt="" />
                                    </div>
                                    <span className='absolute cursor-pointer top-0 right-0 p-2 bg-white z-10 rounded-full'>
                                                <svg xmlns="http://www.w3.org/2000/svg"  width="34" height="34" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                                                </svg>
                                        </span>
                                    </div>
                            )
                        }
                    </label>

                <span className=' text-2xl font-semibold '>Set up your profile</span>
                <span className=' mt-2 text-gray-400'>put your basic info and your fitness goal here</span>
            </div>
            
            <div style={{backgroundColor: themeColor.backgroundColor}} className="profileForm modal-content flex-1 text-white flex flex-col  h-full py-16 px-36">
                <label 
                className=' font-semibold text-lg text-gray-400 '
                htmlFor="firstName">First Name</label>
                <input
                    id='firstName'
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <label 
                className=' font-semibold text-lg text-gray-400 '
                htmlFor="lastName">Last Name</label>
                <input
                    id='lastName'
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                 <label 
                className=' font-semibold text-lg text-gray-400 '
                htmlFor="fitnessGoal">Fitness Goal {'(target weight)'}</label>
                <input
                    id='fitnessGoal'
                    type="number"
                    value={fitnessGoal}
                    maxLength={3}
                    onChange={(e) => setFitnessGoal(e.target.value)}
                />
                <label 
                className=' font-semibold text-lg text-gray-400 '
                htmlFor="startingWeight">Starting Weight</label>
                <input
                    id='startingWeight'
                    type="number"
                    maxLength={3}
                    value={startingWeight}
                    onChange={(e) => setStartingWeight(e.target.value)}
                />
            
                <div className=' mt-16 text-2xl font-semibold  flex w-full  justify-center' >
                    <span onClick={handleSave} className=' border px-4 py-2 rounded-md bg-white text-black pointerFocus'>Save</span>
                </div>
                {/* <button onClick={onClose}>Cancel</button> */}
            </div>
        </div>
    );
};

export default UserProfileModal;
