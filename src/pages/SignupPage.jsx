import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../firebase';
import { themeColor } from '../constants';
 
const SignupPage = () => {
    const navigate = useNavigate();
 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [cfmPassword, setCfmPassword] = useState('');
 
    const onSubmit = async (e) => {
        if(password !== cfmPassword) 
        {
            alert("passwords do not match!")
            setPassword("")
            setCfmPassword("")
            return
        }
      e.preventDefault()
     
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user);
            navigate("/")
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            alert(errorMessage)
            // ..
        });
 
   
    }
 
  return (
    <>
    <main  style={{backgroundColor: '#191920'}} className=' w-full h-full absolute flex flex-col '>
        <header className='welcome-header h-16 flex items-center justify-between px-10 text-gray-100'>
                    <div className=' flex gap-2 items-center'>
                        <img src="/gym.png" alt="" />
                        <span className='  font-semibold'>DuoFit</span>
                    </div>
                    <NavLink to="/">
                        <span className=' pointerFocus '>
                        Sign in
                        </span>
                    </NavLink>
        </header>
       <div className=' w-full flex-1  flex'> 
       <section style={{width: '60%'}} className=' backgroundImage flex justify-center overflow-hidden '>
        </section>   
       <section className='  flex-1 flex flex-col items-center justify-start  m-6 rounded-lg text-gray-100'>
           <header className=' mt-6'>
           <h1 className=' font-extrabold  text-3xl'>
                Create
            <span style={{color: themeColor.primaryColor}} className=' ml-1 text-4xl'>Account</span>
            </h1>
           </header>
            <span className=' mt-4 mb-10 text-sm text-gray-300 '>Join us, fill out the information to start exploring.</span>
            <div style={{width:'80%'}} className=''>                                                                                  
                <form>                                              
                    <div className=' flex flex-col'>
                        <label className='text-sm text-gray-300' htmlFor="email-address">
                            Email address
                        </label>
                        <input
                            className=' inputBox my-2 outline-none py-1'
                            id="email-address"
                            name="email"
                            type="email"                                    
                            required                                                                                
                           
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                    </div>

                    <div className=' flex flex-col mt-8'>
                        <label className='text-sm text-gray-300'  htmlFor="password">
                            Password
                        </label>
                        <input
                         className=' inputBox my-2 outline-none py-1'
                            id="password"
                            name="password"
                            type="password"                                    
                            required                                                                                
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                    </div>
                    <div className=' flex flex-col mt-8'>
                        <label className='text-sm text-gray-300'  htmlFor="cfmPassword">
                            Confirm Password
                        </label>
                        <input
                         className=' inputBox my-2 outline-none py-1'
                            id="cfmPassword"
                            name="cfmPassword"
                            type="password"  
                            value={cfmPassword}                                  
                            required                                                                                
                            
                            onChange={(e)=>setCfmPassword(e.target.value)}
                        />
                    </div>
                     
                        <button         
                         className='pointerFocus w-full flex justify-center my-6 py-3 rounded-2xl text-black text-sm font-semibold'  style={{ backgroundColor: themeColor.primaryColor }}                           
                            onClick={onSubmit}     

                        >      
                            Sign up                                                                  
                        </button>
                    <div className=' relative flex justify-center my-4'>                               
                        <span style={{ backgroundColor:themeColor.backgroundColor }}  className=' text-gray-500  z-10 px-2'>Or</span>
                            <div className=' divider bg-gray-500 '></div>    
                                                         
                    </div>        
     
                </form>
                <button         
                         className='pointerFocus w-full flex justify-center my-6 py-3 rounded-2xl  text-sm font-semibold bg-gray-700 text-white items-center gap-4'                             
                            onClick={()=>{}}     

                        >    
                        <img src="/google.png" alt="" />
                        <span> Continue with Google </span>  
                                                                                       
                        </button>

             
                                           
            </div>
        </section>
      
        </div>   
    </main>
</>
  )
}
 
export default SignupPage