import React, { useState, FormEvent } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { authKey } from '../firebase/FirebaseKey';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const CreateAccountModal: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [fullname, setFullname] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [Reppassword, setRepPassword] = useState<string>('');

    const navigate = useNavigate();

    const clearInputs = () => {
        setEmail('');
        setFullname('');
        setUsername('');
        setPassword('');
        setRepPassword('');
    };

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

    const notif = () => {
        toast.success('Account successfully created, please verify your account.', {
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

    const CreateAccountForUser = async (ev: FormEvent) => {
        ev.preventDefault();

        try {
            const userCred = await createUserWithEmailAndPassword(authKey, email, password);
            if (userCred) {
                await sendEmailVerification(userCred.user);
                const user = authKey.currentUser;
                if (user && !user.emailVerified) {
                    console.log('Please verify your email');
                    clearInputs()
                    notif()
                } else {
                    navigate('/');
                }
            }
        } catch (err: any) {
            if(err === 'Email already in use') {
                errorModal('Email already in use')
            }
            if (err.code === 'auth/email-already-in-use') {
                errorModal('Email already in use')
                clearInputs()
            } else {
                console.error('Error:', err);
                errorModal("There's some error, try again later")
            }
        }
    };

    return (

        <form
            className='flex flex-col gap-3 w-full max-w-[400px] bg-[#f9f9f9] p-3 rounded-lg book'
            onSubmit={CreateAccountForUser}>
            <h1 className='text-center'>Create your ThesisTribe account</h1>
            <ToastContainer />
            <input
                className='border-[1px] border-[#292929] h-[40px] rounded-lg outline-none px-3'
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className='border-[1px] border-[#292929] h-[40px] rounded-lg outline-none px-3'
                type="text"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
            />
            <input
                className='border-[1px] border-[#292929] h-[40px] rounded-lg outline-none px-3'
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className='border-[1px] border-[#292929] h-[40px] rounded-lg outline-none px-3'
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                className='border-[1px] border-[#292929] h-[40px] rounded-lg outline-none px-3'
                type="password"
                placeholder="Repeat Password"
                value={Reppassword}
                onChange={(e) => setRepPassword(e.target.value)}
            />
            <button
                className='bg-[#292929] h-[40px] rounded-lg text-white'
                type="submit">Create Account</button>
            <div className='flex items-center gap-3 justify-center'>
                <div className='w-full h-[1px] bg-[#888]'></div>
                <div>or</div>
                <div className='w-full h-[1px] bg-[#888]'></div>
            </div>
            <div
                onClick={() => { navigate('/sign-in') }}
                className='w-full flex h-[40px] bg-[#292929] items-center justify-center gap-3 rounded-lg text-white cursor-pointer'>
                Sign In
            </div>
        </form>

    );
};

export default CreateAccountModal;
