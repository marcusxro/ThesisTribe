import React from 'react'
import SignInModal from '../comp/SignInModal'
import Header from '../comp/Header'

const SignIn: React.FC = () => {


    return (
        <div className='w-full h-screen flex items-center justify-center p-3 min-h-[600px]'>
            <Header inputSee={false} bookSee={false} />
            <SignInModal isDataSave={false} />
        </div>
    )
}

export default SignIn
