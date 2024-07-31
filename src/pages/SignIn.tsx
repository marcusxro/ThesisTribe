import React, { useEffect } from 'react'
import SignInModal from '../comp/SignInModal'
import Header from '../comp/Header'
import { onAuthStateChanged } from 'firebase/auth'
import { authKey } from '../firebase/FirebaseKey'
import { useNavigate } from 'react-router-dom'
import IsUser from '../comp/IsUser'

const SignIn: React.FC = () => {

    const [user] = IsUser()
    const nav = useNavigate()

    useEffect(() => {
        const unsub = onAuthStateChanged(authKey, (creds) => {
            if (creds) {

            }
        })

        return () => { unsub() }
    }, [])


    return (
        <div className='w-full h-screen flex items-center justify-center p-3 min-h-[600px]'>
            <Header inputSee={false} bookSee={false} locString={'Signin'} />
            {
                user != null && user?.emailVerified ?
                    <div>
                        <div className='text-xl text-center'>      welcome! <span className='font-semibold'>{user?.displayName || user?.email}</span></div>
                       <div className='text-center mt-3 text-[13px] text-gray-700'>Navigate to:</div>
                        <div className='flex gap-3 items-center justify-center mt-1'>
                            <div 
                            onClick={() => {
                                nav('/article')
                            }}
                            className='bg-[#292929] py-1 px-3 rounded-lg text-white cursor-pointer'>
                                Articles
                            </div>
                            <div 
                               onClick={() => {
                                nav('/book-finder')
                            }}
                            className='bg-[#292929] py-1 px-3 rounded-lg text-white cursor-pointer'>
                                Books
                            </div>
                        </div>
                    </div>
                    :

                    <SignInModal isDataSave={false} />
            }
        </div>
    )
}

export default SignIn
