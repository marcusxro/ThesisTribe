import React from 'react'
import CreateAccountModal from '../comp/CreateAccountModal'
import Header from '../comp/Header'

const CreateAccount = () => {
    return (
        <div className='w-full h-screen flex items-center justify-center p-3 min-h-[600px]'>
            <Header inputSee={false} bookSee={false} locString={'Register'} />
            <CreateAccountModal />
        </div>
    )
}

export default CreateAccount
