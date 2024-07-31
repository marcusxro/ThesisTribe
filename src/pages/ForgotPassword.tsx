import React from 'react'
import Header from '../comp/Header'
import ForgotPass from '../comp/ForgotPass'

const ForgotPassword: React.FC = () => {
    return (
        <div>
            <Header bookSee={false} inputSee={false} locString='forgot' />

            <div className='h-[100vh] min-h-[400px] flex items-center justify-center p-3'>
                <ForgotPass />
            </div>
        </div>
    )
}

export default ForgotPassword
