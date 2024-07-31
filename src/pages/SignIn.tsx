import React, { useEffect } from 'react'
import SignInModal from '../comp/SignInModal'
import Header from '../comp/Header'
import { onAuthStateChanged } from 'firebase/auth'
import { authKey } from '../firebase/FirebaseKey'
import { useNavigate } from 'react-router-dom'

const SignIn: React.FC = () => {

    const nav = useNavigate()

    useEffect(() => {
        const unsub = onAuthStateChanged(authKey, (creds) => {
            if(creds) {
                nav(-1)
            }
        })

        return  () => {unsub()}
    },[])


    return (
        <div className='w-full h-screen flex items-center justify-center p-3 min-h-[600px]'>
            <Header inputSee={false} bookSee={false} locString={'Signin'} />
            <SignInModal isDataSave={false} />
        </div>
    )
}

export default SignIn
