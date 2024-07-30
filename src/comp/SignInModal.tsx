import React, { FormEvent, useState } from 'react'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { authKey } from '../firebase/FirebaseKey'
import { FaGoogle } from "react-icons/fa";
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { googleProvider } from '../firebase/FirebaseKey';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


interface boolType {
    isDataSave: boolean
}


const SignInModal: React.FC<boolType> = ({ isDataSave }) => {

    const nav = useNavigate()

    const errorModal = (textStag: string) => {
        toast.error(`${textStag}`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });

    }
    const notif = (textStag: string) => {
        toast.success(`${textStag}`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });

    }

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    function signInWithFireBase(e: FormEvent) {
        e.preventDefault()
        if (password.length === 0 && email.length === 0) {
            return alert("please type somethng")
        }
        signInWithEmailAndPassword(authKey, email, password)
            .then((res) => {


                const user = res.user


                const isVerified = res.user.emailVerified

                console.log(isVerified)


                if (!isVerified) {
                    return errorModal('Please verify your account first')
                } else {
                    notif('User Signed in!')
                    if(user) {
                        nav(-1)
                       }
                       
                    setTimeout(() => {
                        if (!isDataSave) {
                            nav(-1)
                        }
                    }, 1000);
                    console.log('User Info:', {
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                        uid: user.uid,
                    });
            
                }

            }).catch((err) => {
                console.log(err)
            })
    }



    const handleGoogleLogin = async () => {
        try {
             await signInWithPopup(authKey, googleProvider);
        } catch (error) {
            console.error('Error during sign-in:', error);
        }
    };

    return (
        <form
            className='flex flex-col gap-3 w-full max-w-[400px] bg-[#f9f9f9] p-3 rounded-lg book'
            action="submit" onSubmit={signInWithFireBase}>
            <ToastContainer />
            <h1 className='text-center pb-3'>
                Sign in with your ThesisTribe account.
            </h1>
            <input
                placeholder='Email'
                className='border-[1px] border-[#292929] h-[40px] rounded-lg outline-none px-3'
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
                type="email" />

            <input
                placeholder='Password'
                className='border-[1px] border-[#292929] h-[40px] rounded-lg outline-none px-3'
                value={password}
                onChange={(e) => { setPassword(e.target.value) }}
                type="password" />
            <div>
                Forgot Password? <span className='cursor-pointer text-blue-400'>click here!</span>
            </div>

            <button
                className='bg-[#292929] h-[40px] rounded-lg text-white'
                type='submit'>Sign In</button>

            <div className='flex items-center gap-3 justify-center'>
                <div className='w-full h-[1px] bg-[#888]'></div>
                <div>or</div>
                <div className='w-full h-[1px] bg-[#888]'></div>
            </div>

            <div
                onClick={() => { handleGoogleLogin() }}
                className='w-full flex h-[40px] bg-[#292929] items-center justify-center gap-3 rounded-lg text-white cursor-pointer'>
                <div className=''>
                    <FaGoogle />
                </div>
                <div>
                    Sign In with Google
                </div>
            </div>
            <div
                onClick={() => { nav('/sign-up') }}
                className='w-full flex h-[40px] bg-[#292929] items-center justify-center gap-3 rounded-lg text-white cursor-pointer'>
                Create Acount
            </div>
        </form>

    )
}

export default SignInModal
