import React, {useState, useEffect} from 'react';
import {  signInWithEmailAndPassword , onAuthStateChanged  } from 'firebase/auth';
import { auth } from '../firebase';
import { NavLink, useNavigate } from 'react-router-dom'
import { themeColor } from '../constants';
import { Route, Switch } from 'react-router-dom'
 
const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
       
    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            navigate("/home")
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
            alert("failed to login")
        });
    }

    useEffect(()=>{
        onAuthStateChanged(auth, async (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              const uid = user.uid;
              // ...
              console.log("uid", uid)
              navigate("/home")
            }
        }
        )
    }, [])
 
    return(
        <>
            <main  style={{backgroundColor: '#191920'}} className=' w-full h-full absolute flex flex-col '>
            <header className='welcome-header items-center justify-between text-gray-100'>
                            <div className=' flex gap-2 items-center'>
                                <img src="/gym.png" alt="" />
                                <span className='  font-semibold'>DuoFit</span>
                            </div>
                            <NavLink to="/signup">
                                <span className=' pointerFocus mr-10'>
                                Sign up
                                </span>
                            </NavLink>
                </header>
               <div className=' w-full flex-1  flex'> 
               <section className='  flex-1 flex flex-col items-center justify-start  m-6 rounded-lg text-gray-100'>
                   <header className=' mt-6'>
                   <h1 className=' font-extrabold  text-3xl'>
                        Welcome
                    <span style={{color: themeColor.primaryColor}} className=' ml-1 text-4xl'>Back</span>
                    </h1>
                   </header>
                    <span className=' mt-4 mb-10 text-sm text-gray-300 '>Welcome back, fill out the information to start exploring.</span>
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
                                    
                                    onChange={(e)=>setPassword(e.target.value)}
                                />
                            </div>
                            <div className=' text-sm mt-4 flex justify-end'>
                                <span style={{color: themeColor.primaryColor}} className='pointerFocus' >Forgot password</span>    
                            </div>        
                                <button         
                                 className='pointerFocus w-full flex justify-center my-6 py-3 rounded-2xl text-black text-sm font-semibold'  style={{ backgroundColor: themeColor.primaryColor }}                           
                                    onClick={onLogin}     

                                >      
                                    Login                                                                  
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
                <section style={{width: '60%'}} className=' backgroundImage flex justify-center overflow-hidden '>
                </section>   
                </div>   
            </main>
        </>
    )
}
 
export default LoginPage