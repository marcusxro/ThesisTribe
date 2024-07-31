import React, { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth';
import { authKey } from '../firebase/FirebaseKey';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ForgotPass: React.FC = () => {

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

    
    const notifSuccsess = (textStag: string) => {

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

    const nav = useNavigate()
    const [email, setEmail] = useState('');
    const resetPassword = () => {
        if (email.length === 0) {
            errorModal("Please type something")
            return
        }
        sendPasswordResetEmail(authKey, email)
            .then(() => {
                setEmail('')
                notifSuccsess("Verification sent!")
            })
            .catch((error) => {
                if (error.code === 'auth/user-not-found') {
                    errorModal('User does not exist');
                    setEmail('')
                } else {
                    errorModal('There is some error');
                }
            });
    };

    return (
        <div className='flex flex-col gap-3 w-full max-w-[400px] bg-[#f9f9f9] p-3 rounded-lg book'>
              <ToastContainer />
            <div className="forgotPass">
                <div className="text-center font-semibold text-[#292929] mb-3">
                    Recover your account ThesisTribe account.
                </div>
                <input
                    className='border-[1px] border-[#292929] h-[40px] rounded-lg outline-none px-3 w-full'
                    type="email"
                    placeholder='Enter your email'
                    value={email} onChange={(e) => { setEmail(e.target.value) }} />

                <button
                    className='w-full h-[40px] bg-[#292929] text-white rounded-lg hover:bg-gray-700 mt-2'
                    onClick={resetPassword}>Send verification</button>
                <div className="text-left my-3">
                    Recovered your account? click here to <span className='text-blue-400 cursor-pointer' onClick={() => { nav('/sign-in') }}>Sign in</span>
                </div>
            </div>
        </div>
    )
}

export default ForgotPass
